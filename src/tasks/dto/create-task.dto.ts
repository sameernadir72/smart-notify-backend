import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the task',
  })
  title: string;
  @ApiProperty({
    example: 'Milk, Bread, Eggs',
    description: 'The description of the task',
  })
  description: string;
  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'The due date of the task in ISO 8601 format',
  })
  due_date: string;
  @ApiProperty({
    example: 'MOOD',
    description: 'The priority of the task',
  })
  mood: string;
  // is_completed
  @ApiProperty({
    example: false,
    description: 'Whether the task is completed or not',
  })
  is_completed: boolean;
  // is_notified
  @ApiProperty({
    example: false,
    description: 'Whether the user has been notified about the task or not',
  })
  is_notified: boolean;
  // ai_suggestion
  @ApiProperty({
    example: '',
    description: 'The AI suggestion for the task',
  })
  ai_suggestion: string;

  // user_id
  @ApiProperty({
    example: 'user-id-123',
    description: 'The ID of the user who created the task',
  })
  user_id: string;
}
