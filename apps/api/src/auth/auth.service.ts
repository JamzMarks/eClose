// users/users.service.ts

import { Injectable, BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { IAuthService } from "./interfaces/auth.interface";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService implements IAuthService{
  async signIn(dto: SignInDto) {
    return 'signUp';
  }

  async signUp(dto: SignUpDto) {
    return 'signUp';
  }
}