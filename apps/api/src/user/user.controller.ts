import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { QuickSignupDto } from "./dto/quick-signup.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  /** Cadastro rápido na própria app (confirmação in-app, sem redirecionar para outro produto) */
  @Post("quick-signup")
  quickSignup(@Body() dto: QuickSignupDto) {
    return this.usersService.quickSignup(dto);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}