import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";
import type { BookingAccessPolicyPort } from "@/booking/application/ports/booking-access.policy.port";
import { BOOKING_ACCESS_POLICY } from "@/booking/application/ports/booking-access.policy.port";

@Injectable()
export class BookingInquiryRequesterHttpGuard implements CanActivate {
  constructor(
    @Inject(BOOKING_ACCESS_POLICY)
    private readonly policy: BookingAccessPolicyPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      user?: JwtValidatedUser;
      params: { id: string };
    }>();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    try {
      await this.policy.ensureActorIsRequesterForInquiry(userId, req.params.id);
      return true;
    } catch (e) {
      if (e instanceof ResourceNotFoundError) throw new NotFoundException(e.message);
      if (e instanceof AccessDeniedError) throw new ForbiddenException(e.message);
      throw e;
    }
  }
}
