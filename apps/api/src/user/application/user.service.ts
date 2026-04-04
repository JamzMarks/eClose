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
import { IVenueRepository } from "@/venue/application/ports/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/application/tokens/venue.tokens";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NOTIFICATION_SERVICE } from "@/notification/tokens/notification.tokens";
import { NotificationType } from "@/notification/types/notification.type";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { SocialUser } from "@/user/domain/entity/social-user.entity";
import { CompleteProfileNamesDto } from "@/user/interface/http/dto/complete-profile-names.dto";
import { QuickSignupDto } from "@/user/interface/http/dto/quick-signup.dto";
import { UpdateNotificationPreferencesDto } from "@/user/interface/http/dto/update-notification-preferences.dto";
import { UpdatePushTokensDto } from "@/user/interface/http/dto/update-push-tokens.dto";
import { applySocialUserToRow, socialUserFromRow } from "@/user/infrastructure/persistence/user.orm-mapper";
import { IUserService } from "@/user/application/ports/user.service.interface";

@Injectable()
export class UserService implements IUserService {
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
      username: dto.username,
      email,
      phone,
      passwordHash,
      birthDate,
      countryCode: dto.countryCode ?? null,
      locale: dto.locale ?? null,
      marketingOptIn: dto.marketingOptIn ?? false,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
    });

    const row = new UserOrmEntity();
    applySocialUserToRow(user, row);
    row.notificationPreferences = { email: true, push: true, sms: true };
    row.pushTokens = [];
    if (user.firstName?.trim() && user.lastName?.trim()) {
      row.profileNamesAcknowledgedAt = new Date();
    }
    await this.users.save(row);

    if (this.notifications && user.email) {
      await this.notifications.sendNotification({
        userId: user.id,
        type: NotificationType.WELCOME,
        title: "Bem-vindo ao eClose",
        body: `Olá, ${user.username}. Confirme seu e-mail na próxima tela para liberar todos os recursos.`,
        toEmail: user.email,
        channel: undefined,
      });
    }

    return user;
  }

  async findById(id: string): Promise<SocialUser | undefined> {
    const row = await this.users.findOne({ where: { id } });
    if (!row) return undefined;
    return socialUserFromRow(row);
  }

  async findAll(): Promise<SocialUser[]> {
    const rows = await this.users.find();
    return rows.map((r) => socialUserFromRow(r));
  }

  async getSessionProfile(userId: string) {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    return {
      id: row.id,
      email: row.email ?? "",
      username: row.username,
      firstName: row.firstName ?? null,
      lastName: row.lastName ?? null,
      emailVerifiedAt: row.emailVerifiedAt,
      eventInterests: Array.isArray(row.eventInterests) ? [...row.eventInterests] : [],
      profileNamesAcknowledgedAt: row.profileNamesAcknowledgedAt,
    };
  }

  /** Persiste nome próprio + apelido; políticas como e-mail verificado ficam na camada HTTP. */
  async completeProfileNames(userId: string, dto: CompleteProfileNamesDto): Promise<void> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();
    if (!firstName || !lastName) {
      throw new BadRequestException("Nome e apelido são obrigatórios");
    }
    row.firstName = firstName;
    row.lastName = lastName;
    row.username = `${firstName} ${lastName}`.trim();
    row.profileNamesAcknowledgedAt = new Date();
    await this.users.save(row);
  }

  async updateEventInterests(userId: string, interests: string[]): Promise<string[]> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    const normalized = [
      ...new Set(
        interests
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
          .slice(0, 100),
      ),
    ];
    row.eventInterests = normalized;
    await this.users.save(row);
    return normalized;
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

  async markEmailVerified(userId: string): Promise<void> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    if (row.emailVerifiedAt) return;
    row.emailVerifiedAt = new Date();
    await this.users.save(row);
  }
}
