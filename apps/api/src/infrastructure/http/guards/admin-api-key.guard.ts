import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ADMIN_API_KEY?.trim();
    if (!expected) {
      throw new UnauthorizedException("ADMIN_API_KEY não configurada");
    }
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers["x-admin-api-key"];
    const key = Array.isArray(header) ? header[0] : header;
    if (!key || key !== expected) {
      throw new UnauthorizedException("Chave de admin inválida");
    }
    return true;
  }
}
