import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { IVenueRepository } from "@/venue/interfaces/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/tokens/venue.tokens";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NOTIFICATION_SERVICE } from "@/notification/tokens/notification.tokens";
import { NotificationType } from "@/notification/types/notification.type";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { SocialUser } from "./entity/social-user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { QuickSignupDto } from "./dto/quick-signup.dto";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";
import { UpdatePushTokensDto } from "./dto/update-push-tokens.dto";
import { applySocialUserToRow, socialUserFromRow } from "./infrastructure/user.orm-mapper";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(ARTIST_REPOSITORY)
    private readonly artists: IArtistRepository,
    @Inject(VENUE_REPOSITORY)
    private readonly venues: IVenueRepository,
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
    row.notificationPreferences = { email: true, push: true, sms: true };
    row.pushTokens = [];
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

  async getNotificationPreferences(userId: string) {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    return row.notificationPreferences ?? { email: true, push: true, sms: true };
  }

  async updateNotificationPreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    const cur = row.notificationPreferences ?? { email: true, push: true, sms: true };
    row.notificationPreferences = {
      email: dto.email ?? cur.email,
      push: dto.push ?? cur.push,
      sms: dto.sms ?? cur.sms,
    };
    await this.users.save(row);
    return row.notificationPreferences;
  }

  async getPushTokens(userId: string): Promise<string[]> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    return Array.isArray(row.pushTokens) ? row.pushTokens.map(String) : [];
  }

  /**
   * Substitui a lista de tokens FCM/device. `NotificationService` / `TypeormUserNotificationTargets`
   * leem a mesma coluna `push_tokens`.
   */
  async updatePushTokens(userId: string, dto: UpdatePushTokensDto): Promise<string[]> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    const normalized = [
      ...new Set(
        dto.pushTokens.map((t) => t.trim()).filter((t) => t.length > 0),
      ),
    ];
    row.pushTokens = normalized;
    await this.users.save(row);
    return normalized;
  }

  async listLinkedEntities(userId: string) {
    const artists = (await this.artists.listAll())
      .filter((a) => a.ownerId === userId)
      .map((a) => ({
        kind: "artist" as const,
        id: a.id,
        slug: a.slug,
        name: a.name,
      }));
    const venues = (await this.venues.listActive())
      .filter((v) => v.ownerUserId === userId)
      .map((v) => ({
        kind: "venue" as const,
        id: v.id,
        slug: v.slug,
        name: v.name,
      }));
    return { artists, venues };
  }
}
