import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateSharedEventListDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;
}
