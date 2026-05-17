import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the task',
  })
  title?: string;
  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'The due date of the task in ISO 8601 format',
  })
  due_date?: string;
  @ApiProperty({
    example: 'MOOD',
    description: 'The priority of the task',
  })
  mood?: string;
  is_completed?: boolean;
  is_notified?: boolean;
  ai_suggestion?: string;
  user_id?: string;
}
