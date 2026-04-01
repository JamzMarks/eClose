import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Optional,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NOTIFICATION_SERVICE } from "@/notification/tokens/notification.tokens";
import { NotificationType } from "@/notification/types/notification.type";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { SocialUser } from "./entity/social-user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { QuickSignupDto } from "./dto/quick-signup.dto";
import { applySocialUserToRow, socialUserFromRow } from "./infrastructure/user.orm-mapper";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Optional()
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifications?: INotificationService,
  ) {}

  async quickSignup(dto: QuickSignupDto): Promise<SocialUser> {
    const email = dto.email?.trim().toLowerCase() ?? null;
    const phone = dto.phone?.trim() ?? null;
    if (!email && !phone) {
      throw new BadRequestException("E-mail ou telefone é obrigatório");
    }
    if (email) {
      const taken = await this.users.findOne({ where: { email } });
      if (taken) throw new ConflictException("E-mail já cadastrado");
    }
    if (phone) {
      const taken = await this.users.findOne({ where: { phone } });
      if (taken) throw new ConflictException("Telefone já cadastrado");
    }

    const birthDate = new Date(dto.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      throw new BadRequestException("Data de nascimento inválida");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = SocialUser.registerQuick({
      id: this.ids.generate(),
      displayName: dto.displayName,
      email,
      phone,
      passwordHash,
      birthDate,
      countryCode: dto.countryCode ?? null,
      locale: dto.locale ?? null,
      marketingOptIn: dto.marketingOptIn ?? false,
    });

    const row = new UserOrmEntity();
    applySocialUserToRow(user, row);
    await this.users.save(row);

    if (this.notifications && user.email) {
      await this.notifications.sendNotification({
        userId: user.id,
        type: NotificationType.WELCOME,
        title: "Bem-vindo ao eClose",
        body: `Olá, ${user.displayName}. Confirme seu e-mail na próxima tela para liberar todos os recursos.`,
        toEmail: user.email,
        channel: undefined,
      });
    }

    return user;
  }

  /** Cadastro “completo” legado: mapeia para o mesmo agregado SocialUser */
  async create(dto: CreateUserDto): Promise<SocialUser> {
    const displayName = `${dto.firstName} ${dto.lastName}`.trim();
    return this.quickSignup({
      displayName: displayName || dto.userName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      countryCode: dto.countryCode,
      locale: dto.locale,
      password: dto.password,
      termsAccepted: true,
      privacyAccepted: true,
      marketingOptIn: dto.marketingOptIn ?? false,
    });
  }

  async findById(id: string): Promise<SocialUser | undefined> {
    const row = await this.users.findOne({ where: { id } });
    if (!row?.birthDate || !row.termsAcceptedAt || !row.privacyAcceptedAt) return undefined;
    return socialUserFromRow(row);
  }

  async findAll(): Promise<SocialUser[]> {
    const rows = await this.users
      .createQueryBuilder("u")
      .where("u.birthDate IS NOT NULL")
      .andWhere("u.termsAcceptedAt IS NOT NULL")
      .andWhere("u.privacyAcceptedAt IS NOT NULL")
      .getMany();
    return rows.map((r) => socialUserFromRow(r));
  }
}
