import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({
    example: 'dGhpcyBpcyBhIGZha2UgZmNtIHRva2Vu...',
    description: 'The FCM device token to register for push notifications',
  })
  @IsString()
  @IsNotEmpty()
  fcm_token!: string;
}
