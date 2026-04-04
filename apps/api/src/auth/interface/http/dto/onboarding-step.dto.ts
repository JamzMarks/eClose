import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

export const ONBOARDING_STEPS = [
  "names",
  "notification_preferences",
  "event_interests",
] as const;

export type OnboardingStepKind = (typeof ONBOARDING_STEPS)[number];

export class OnboardingStepDto {
  @IsIn(ONBOARDING_STEPS)
  step!: OnboardingStepKind;

  @ValidateIf((o: OnboardingStepDto) => o.step === "names")
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ValidateIf((o: OnboardingStepDto) => o.step === "names")
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @ValidateIf((o: OnboardingStepDto) => o.step === "notification_preferences")
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ValidateIf((o: OnboardingStepDto) => o.step === "notification_preferences")
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ValidateIf((o: OnboardingStepDto) => o.step === "notification_preferences")
  @IsOptional()
  @IsBoolean()
  sms?: boolean;

  @ValidateIf((o: OnboardingStepDto) => o.step === "event_interests")
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @MaxLength(128, { each: true })
  eventInterests?: string[];
}
