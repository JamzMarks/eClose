import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { OAuthAccountOrmEntity } from "@/auth/infrastructure/persistence/oauth-account.orm-entity";
import { RefreshTokenOrmEntity } from "@/auth/infrastructure/persistence/refresh-token.orm-entity";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { JWT_ACCESS_EXPIRES } from "./auth.constants";
import { MfaSetupDto } from "./dto/mfa-setup.dto";
import { OAuthCallbackDto } from "./dto/oauth-callback.dto";
import { OAuthStartDto } from "./dto/oauth-start.dto";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UserProfileDto } from "./dto/user-profile.dto";
import { IAuthService, AuthResponse } from "./interfaces/auth.interface";
import {
  IOAuthProviderGateway,
  OAuthAuthorizeResult,
} from "./interfaces/oauth-provider-gateway.interface";
import { OAUTH_PROVIDER_GATEWAY } from "./tokens/auth.tokens";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(OAUTH_PROVIDER_GATEWAY)
    private readonly oauthGateway: IOAuthProviderGateway,
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
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const row = new UserOrmEntity();
    row.id = id;
    row.email = key;
    row.passwordHash = passwordHash;
    row.displayName = dto.email.split("@")[0] || "user";
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
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return { id: user.id, email: user.email ?? "" };
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
      if (!user) {
        user = new UserOrmEntity();
        user.id = randomUUID();
        user.email = identity.email ?? null;
        user.passwordHash = null;
        user.displayName = identity.name?.trim() || identity.email?.split("@")[0] || "user";
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
      }
      userId = user.id;
      const link = new OAuthAccountOrmEntity();
      link.id = randomUUID();
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

  async sendEmailVerification(_userId: string): Promise<void> {
    this.notImplemented("verificação de e-mail");
  }

  async verifyEmail(_token: string): Promise<void> {
    this.notImplemented("confirmar verificação de e-mail");
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
    row.id = randomUUID();
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
