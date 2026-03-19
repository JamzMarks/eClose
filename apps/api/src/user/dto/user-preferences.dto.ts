import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Theme } from "../types/theme.type";
import { ProfileVisibility } from "../types/profile-visibility.type";

export class UserPreferencesDto {

  // 🎨 UI
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;

  // 🔔 notificações
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  // 🔒 privacidade
  @IsOptional()
  @IsEnum(ProfileVisibility)
  profileVisibility?: ProfileVisibility;

  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSearchByEmail?: boolean;

  @IsOptional()
  @IsNumber()
  itemsPerPage?: number;

  // 🌎 localização
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;
}