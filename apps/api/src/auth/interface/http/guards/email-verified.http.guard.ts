import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { JwtValidatedUser } from "@/auth/infrastructure/passport/jwt.strategy";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";


@Injectable()
export class EmailVerifiedHttpGuard implements CanActivate {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user?: JwtValidatedUser }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    const row = await this.users.findOne({
      where: { id: userId },
      select: { id: true, emailVerifiedAt: true },
    });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    if (!row.emailVerifiedAt) {
      throw new ForbiddenException(
        "Confirme o seu e-mail antes de definir o nome oficial do perfil.",
      );
    }
    return true;
  }
}
