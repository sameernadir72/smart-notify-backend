import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm'; // <-- Added LessThanOrEqual
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule'; // <-- Added Cron
import { GoogleGenerativeAI } from '@google/generative-ai'; // <-- Added Gemini

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private configService: ConfigService,
    // private firebaseService: FirebaseService, // <-- Inject Firebase
  ) {
    // Initialize Gemini AI
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY') || 'fallback_key',
    );
  }

  // ==========================================
  // 1. STANDARD CRUD OPERATIONS (Your Code)
  // ==========================================
  async create(createTaskDto: CreateTaskDto, secureUserId: string) {
    const aiSuggestion = await this.getAiSuggestion(
      createTaskDto.title,
      createTaskDto.mood,
    );

    const task = this.tasksRepository.create({
      ...createTaskDto,
      ai_suggestion: aiSuggestion,
      user: { id: secureUserId } as any,
    });
    return this.tasksRepository.save(task);
  }

  async findAll() {
    return this.tasksRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.tasksRepository.findOne({ where: { id } });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update({ id }, { ...updateTaskDto });
  }

  remove(id: string) {
    return this.tasksRepository.delete(id);
  }

  // ==========================================
  // 2. AI INTEGRATION (Google Gemini)
  // ==========================================
  async getAiSuggestion(title: string, mood: string): Promise<string> {
    try {
      if (!this.isValidTodoText(title)) {
        return 'You can do this! Take the first step today.';
      }
      const modelName = 'gemini-2.5-flash';
      const model = this.genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are a supportive habit coach. The user needs to do this task: "${title}". Their current mood is: "${mood}". Give a 1-sentence, highly motivational tip to help them start. Be concise.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Error:', error);
      return 'You can do this! Take the first step today.'; // Fallback message
    }
  }

  private isValidTodoText(title: string): boolean {
    const trimmed = (title || '').trim();

    // 1. Min length check
    if (trimmed.length < 4) return false;

    // 2. Must have at least one real word (3+ chars)
    const wordMatches = trimmed.match(/[A-Za-z]{3,}/g) || [];
    if (wordMatches.length < 1) return false;

    // 3. Letter ratio check
    const letterMatches = trimmed.match(/[A-Za-z]/g) || [];
    const letterRatio = letterMatches.length / trimmed.length;
    if (letterRatio < 0.5) return false;

    // 4. Block keyboard mash patterns (no vowel = random typing)
    const hasVowel = /[aeiouAEIOU]/.test(trimmed);
    if (!hasVowel) return false;

    // 5. Block repeated characters like "aaaa", "zzzz"
    if (/(.)\1{3,}/.test(trimmed)) return false;

    // 6. Block common random patterns
    const randomPatterns = /^[qwrtpsdfghjklzxcvbnm]{4,}$/i;
    if (randomPatterns.test(trimmed.replace(/\s/g, ''))) return false;

    return true;
  }

  // ==========================================
  // 3. AGENTIC CRON JOB (Firebase Push)
  // ==========================================
  @Cron('* * * * *') // Runs every 60 seconds
  async handleCron() {
    const now = new Date();

    // Find tasks that are due, not completed, and not notified yet
    const pendingTasks = await this.tasksRepository.find({
      where: {
        is_completed: false,
        is_notified: false,
        due_date: LessThanOrEqual(now),
      },
      relations: ['user'], // MUST load user to get their fcm_token
    });
    console.log(`Found ${pendingTasks.length} pending tasks due now.`);
    if (pendingTasks.length === 0) return;

    for (const task of pendingTasks) {
      const userToken = task.user?.fcm_token;
      const title = `🚨 Reminder: ${task.title}`;
      const body =
        task.ai_suggestion ||
        "It's time to complete your task! Open the app now.";

      // Send via Firebase
      // if (userToken) {
      //   await this.firebaseService.sendPushNotification(userToken, title, body);
      //   console.log(`✅ Sent push notification to ${task.user.email}`);
      // } else {
      //   console.log(
      //     `⚠️ User ${task.user?.email} has no FCM token. Cannot send push.`,
      //   );
      // }

      // Mark as notified so it doesn't send again next minute
      task.is_notified = true;
      await this.tasksRepository.save(task);
    }
  }
}
