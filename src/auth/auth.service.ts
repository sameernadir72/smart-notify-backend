import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
// Define the shapes of your responses
export interface SignupResponse {
  id: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  access_token: string;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // <--- Add JWT Service
  ) {}

  async signup(email: string, pass: string): Promise<SignupResponse> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const newUser = this.usersRepository.create({
      email,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return {
      id: savedUser.id,
      email: savedUser.email,
      message: 'User created successfully',
    };
  }

  // --- NEW LOGIN METHOD ---
  async login(email: string, pass: string): Promise<LoginResponse> {
    // 1. Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Check if password is correct
    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate the JWT (VIP Pass)
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
