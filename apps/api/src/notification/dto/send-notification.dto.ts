import { CommunicationChannel } from "../types/communication-channel.type";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { NotificationType } from "../types/notification.type";

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(CommunicationChannel)
  channel?: CommunicationChannel;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  /** Quando o resolver de usuário ainda não tem dados (MVP) ou envio pontual */
  @IsOptional()
  @IsEmail()
  toEmail?: string;

  @IsOptional()
  @IsString()
  toPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pushTokens?: string[];

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  templateVersion?: string;

  @IsOptional()
  @IsString()
  htmlBody?: string;
}