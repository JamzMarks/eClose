import {
  Equals,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

/**
 * Cadastro inicial rápido; confirmação de e-mail/telefone fica na mesma aplicação (OTP/link in-app).
 */
export class QuickSignupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  @ValidateIf((o: QuickSignupDto) => !o.phone)
  @IsEmail()
  email?: string;

  @ValidateIf((o: QuickSignupDto) => !o.email)
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  phone?: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string;

  @IsOptional()
  @IsString()
  @Length(2, 12)
  locale?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @Equals(true, { message: "É necessário aceitar os termos de uso" })
  termsAccepted!: true;

  @Equals(true, { message: "É necessário aceitar a política de privacidade" })
  privacyAccepted!: true;

  @IsOptional()
  @IsBoolean()
  marketingOptIn?: boolean;
}
