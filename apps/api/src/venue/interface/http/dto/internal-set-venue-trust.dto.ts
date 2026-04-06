import { IsIn, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class InternalSetVenueTrustDto {
  @IsIn(["verified_l2", "rejected"])
  status!: "verified_l2" | "rejected";

  @ValidateIf((o: InternalSetVenueTrustDto) => o.status === "rejected")
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  rejectionReason?: string;
}
