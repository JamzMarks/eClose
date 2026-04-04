import { IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Legado / formulários genéricos. Para nome oficial após verificação de e-mail,
 * usar `PATCH /auth/me/onboarding` com `step: "names"`.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio?: string;
}

/** Alias histórico (plano de produto). */
export type UpdateProfileDto = UpdateUserDto;
