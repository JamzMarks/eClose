

import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

}