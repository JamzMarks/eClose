// users/users.service.ts

import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {

  private users = [];

  async create(dto: CreateUserDto) {

    if (!dto.email && !dto.phone) {
      throw new BadRequestException("Email ou telefone é obrigatório");
    }

    const user = {
      id: randomUUID(),
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      createdAt: new Date(),
      status: "ACTIVE",
      lgpdConsentAt: null
    };

    this.users.push(user);

    return user;
  }

  async findById(id: string) {
    return this.users.find(u => u.id === id);
  }

  async findAll() {
    return this.users;
  }

}