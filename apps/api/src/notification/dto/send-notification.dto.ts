import { NotificationType } from '../entities/notification.entity';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}