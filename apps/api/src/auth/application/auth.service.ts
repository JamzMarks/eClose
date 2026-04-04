import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { Repository } from "typeorm";
import { OAuthAccountOrmEntity } from "@/auth/infrastructure/persistence/oauth-account.orm-entity";
import { RefreshTokenOrmEntity } from "@/auth/infrastructure/persistence/refresh-token.orm-entity";
import { IUserService } from "@/user/application/ports/user.service.interface";
import { USER_SERVICE } from "@/user/application/tokens/user.tokens";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import {
  EMAIL_VERIFY_JWT_PURPOSE,
  JWT_ACCESS_EXPIRES,
  JWT_EMAIL_VERIFY_EXPIRES,
} from "@/auth/application/auth.constants";
import { MfaSetupDto } from "@/auth/interface/http/dto/mfa-setup.dto";
import { OAuthCallbackDto } from "@/auth/interface/http/dto/oauth-callback.dto";
import { OAuthStartDto } from "@/auth/interface/http/dto/oauth-start.dto";
import { SignInDto } from "@/auth/interface/http/dto/signin.dto";
import { SignUpDto } from "@/auth/interface/http/dto/signup.dto";
import { namesFromOAuthIdentity } from "@/auth/application/utils/names-from-oauth-identity";
import { OnboardingStepDto } from "@/auth/interface/http/dto/onboarding-step.dto";
import { UserProfileDto, type AuthProfileCompletion } from "@/auth/interface/http/dto/user-profile.dto";
import { IAuthService, AuthResponse, type OnboardingStepResult } from "@/auth/application/ports/auth.interface";
import {
  IOAuthProviderGateway,
  OAuthAuthorizeResult,
} from "@/auth/application/ports/oauth-provider-gateway.interface";
import { OAUTH_PROVIDER_GATEWAY } from "@/auth/application/tokens/auth.tokens";

@Injectable()
export class AuthService implements IAuthService {
  private readonly log = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    @Inject(ID_GENERATOR)
    private readonly ids: IdGenerator,
    @Inject(OAUTH_PROVIDER_GATEWAY)
    private readonly oauthGateway: IOAuthProviderGateway,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly refreshTokens: Repository<RefreshTokenOrmEntity>,
    @InjectRepository(OAuthAccountOrmEntity)
    private readonly oauthAccounts: Repository<OAuthAccountOrmEntity>,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const key = dto.email.toLowerCase();
    const existing = await this.users.findOne({ where: { email: key } });
    if (existing) throw new ConflictException("E-mail já cadastrado");
    const id = this.ids.generate();
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const row = new UserOrmEntity();
    row.id = id;
    row.email = key;
    row.passwordHash = passwordHash;
    row.username = dto.username;
    row.phone = null;
    row.handle = null;
    row.birthDate = null;
    row.countryCode = null;
    row.locale = "pt-BR";
    row.avatarUrl = null;
    row.bio = null;
    row.eventInterests = [];
    row.emailVerifiedAt = null;
    row.phoneVerifiedAt = null;
    row.termsAcceptedAt = null;
    row.privacyAcceptedAt = null;
    row.marketingOptIn = false;
    row.isActive = true;
    await this.users.save(row);
    return this.issueTokens(id);
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Credenciais inválidas");
    return this.issueTokens(user.id);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const row = await this.refreshTokens.findOne({ where: { token: refreshToken } });
    if (!row) throw new UnauthorizedException("Refresh inválido ou revogado");
    await this.refreshTokens.delete({ id: row.id });
    return this.issueTokens(row.userId);
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokens.delete({ userId });
  }

  async me(userId: string): Promise<UserProfileDto> {
    const s = await this.userService.getSessionProfile(userId);
    const needsEmailVerification = !s.emailVerifiedAt;
    const hasBothNames = Boolean(s.firstName?.trim() && s.lastName?.trim());
    const namesAcknowledged = Boolean(s.profileNamesAcknowledgedAt);
    const namesComplete = hasBothNames && namesAcknowledged;
    const needsProfileNames = !namesComplete;
    const needsEventInterests =
      namesComplete && (s.eventInterests?.length ?? 0) === 0;
    let profileCompletion: AuthProfileCompletion;
    if (namesComplete) profileCompletion = "full";
    else if (s.emailVerifiedAt) profileCompletion = "verified";
    else profileCompletion = "minimal";
    return {
      id: s.id,
      email: s.email,
      username: s.username,
      firstName: s.firstName,
      lastName: s.lastName,
      profileNamesAcknowledgedAt: s.profileNamesAcknowledgedAt?.toISOString() ?? null,
      emailVerifiedAt: s.emailVerifiedAt?.toISOString() ?? null,
      needsEmailVerification,
      needsProfileNames,
      needsEventInterests,
      profileCompletion,
    };
  }

  async submitOnboardingStep(userId: string, dto: OnboardingStepDto): Promise<OnboardingStepResult> {
    switch (dto.step) {
      case "names": {
        const s = await this.userService.getSessionProfile(userId);
        if (!s.emailVerifiedAt) {
          throw new ForbiddenException(
            "Confirme o seu e-mail antes de definir o nome oficial do perfil.",
          );
        }
        await this.userService.completeProfileNames(userId, {
          firstName: dto.firstName!,
          lastName: dto.lastName!,
        });
        return { step: "names" };
      }
      case "notification_preferences": {
        const preferences = await this.userService.updateNotificationPreferences(userId, {
          email: dto.email,
          push: dto.push,
          sms: dto.sms,
        });
        return { step: "notification_preferences", preferences };
      }
      case "event_interests": {
        const eventInterests = await this.userService.updateEventInterests(
          userId,
          dto.eventInterests ?? [],
        );
        return { step: "event_interests", eventInterests };
      }
    }
  }

  async startOAuthLogin(dto: OAuthStartDto): Promise<OAuthAuthorizeResult> {
    return this.oauthGateway.buildAuthorizationUrl({
      provider: dto.provider,
      redirectUri: dto.redirectUri,
      state: dto.state,
    });
  }

  async completeOAuthLogin(dto: OAuthCallbackDto): Promise<AuthResponse> {
    const identity = await this.oauthGateway.exchangeCode({
      provider: dto.provider,
      code: dto.code,
      redirectUri: dto.redirectUri,
      codeVerifier: dto.codeVerifier,
      state: dto.state,
    });
    const existingLink = await this.oauthAccounts.findOne({
      where: { provider: identity.provider, providerAccountId: identity.providerAccountId },
    });
    let userId = existingLink?.userId;
    if (!userId) {
      const email = identity.email?.toLowerCase();
      let user: UserOrmEntity | null = null;
      if (email) {
        user = await this.users.findOne({ where: { email } });
      }
      const parsed = namesFromOAuthIdentity(identity);
      if (!user) {
        user = new UserOrmEntity();
        user.id = this.ids.generate();
        user.email = identity.email ?? null;
        user.passwordHash = null;
        const fromParsedDisplay =
          parsed.firstName && parsed.lastName
            ? `${parsed.firstName} ${parsed.lastName}`.trim()
            : undefined;
        user.username =
          fromParsedDisplay ||
          identity.name?.trim() ||
          identity.email?.split("@")[0] ||
          "user";
        user.firstName = parsed.firstName;
        user.lastName = parsed.lastName;
        user.profileNamesAcknowledgedAt = null;
        user.phone = null;
        user.handle = null;
        user.birthDate = null;
        user.countryCode = null;
        user.locale = "pt-BR";
        user.avatarUrl = identity.picture ?? null;
        user.bio = null;
        user.eventInterests = [];
        user.emailVerifiedAt = identity.emailVerified ? new Date() : null;
        user.phoneVerifiedAt = null;
        user.termsAcceptedAt = null;
        user.privacyAcceptedAt = null;
        user.marketingOptIn = false;
        user.isActive = true;
        if (!user.email) {
          user.email = `${identity.providerAccountId}@${identity.provider}.oauth.local`;
        }
        await this.users.save(user);
      } else {
        const emptyNames = !user.firstName?.trim() && !user.lastName?.trim();
        if (emptyNames && (parsed.firstName || parsed.lastName)) {
          user.firstName = parsed.firstName;
          user.lastName = parsed.lastName;
          user.profileNamesAcknowledgedAt = null;
          if (parsed.firstName && parsed.lastName) {
            user.username = `${parsed.firstName} ${parsed.lastName}`.trim();
          }
          await this.users.save(user);
        }
      }
      userId = user.id;
      const link = new OAuthAccountOrmEntity();
      link.id = this.ids.generate();
      link.provider = identity.provider;
      link.providerAccountId = identity.providerAccountId;
      link.userId = userId;
      await this.oauthAccounts.save(link);
    }
    return this.issueTokens(userId);
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokens.delete({ token });
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.logout(userId);
  }

  async requestPasswordReset(_email: string): Promise<void> {
    this.notImplemented("reset de senha por e-mail");
  }

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    this.notImplemented("conclusão de reset de senha");
  }

  async changePassword(
    _userId: string,
    _currentPassword: string,
    _newPassword: string,
  ): Promise<void> {
    this.notImplemented("alteração de senha");
  }

  async sendEmailVerification(userId: string): Promise<void> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) throw new NotFoundException("Utilizador não encontrado");
    if (!row.email?.trim()) {
      throw new BadRequestException("Conta sem e-mail para verificar");
    }
    if (row.emailVerifiedAt) return;
    const token = this.jwt.sign(
      { sub: userId, purpose: EMAIL_VERIFY_JWT_PURPOSE },
      { expiresIn: JWT_EMAIL_VERIFY_EXPIRES as import("@nestjs/jwt").JwtSignOptions["expiresIn"] },
    );
    this.log.log(
      `[email-verification] link token for ${row.email} (enviar por canal de notificação quando existir): ${token}`,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    let payload: { sub?: string; purpose?: string };
    try {
      payload = this.jwt.verify<{ sub?: string; purpose?: string }>(token);
    } catch {
      throw new BadRequestException("Token inválido ou expirado");
    }
    if (payload.purpose !== EMAIL_VERIFY_JWT_PURPOSE || !payload.sub) {
      throw new BadRequestException("Token inválido");
    }
    await this.userService.markEmailVerified(payload.sub);
  }

  async changeEmail(_userId: string, _newEmail: string): Promise<void> {
    this.notImplemented("troca de e-mail");
  }

  async enableMfa(_userId: string): Promise<MfaSetupDto> {
    this.notImplemented("MFA");
  }

  async verifyMfa(_userId: string, _code: string): Promise<boolean> {
    this.notImplemented("MFA");
  }

  async disableMfa(_userId: string, _code: string): Promise<void> {
    this.notImplemented("MFA");
  }

  private async issueTokens(userId: string): Promise<AuthResponse> {
    const accessToken = this.jwt.sign({ sub: userId }, {
      expiresIn: JWT_ACCESS_EXPIRES as import("@nestjs/jwt").JwtSignOptions["expiresIn"],
    });
    const token = randomUUID();
    const row = new RefreshTokenOrmEntity();
    row.id = this.ids.generate();
    row.token = token;
    row.userId = userId;
    await this.refreshTokens.save(row);
    return {
      accessToken,
      refreshToken: token,
      tokenType: "Bearer",
    };
  }

  private notImplemented(feature: string): never {
    throw new HttpException(`${feature}: não implementado no MVP`, HttpStatus.NOT_IMPLEMENTED);
  }
}
