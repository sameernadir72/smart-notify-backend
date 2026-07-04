import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const secureUserId = req.user?.id || 'unknown'; // <-- Extract the user ID from the request (set by JwtStrategy)  console.log('🚀 ~ TasksController ~ create ~ secureUserId:', req);
    // We are passing TWO things to the Service now:
    return this.tasksService.create(createTaskDto, secureUserId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    // return a string just to show that we got the correct ID and DTO from the request
    return {
      ...this.tasksService.update(id, updateTaskDto),
      id,
      updateTaskDto,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
