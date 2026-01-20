import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const roleHeader = request.headers['x-role'];
    const currentRole: Role | undefined = roleHeader as Role | undefined;

    if (!currentRole) {
      throw new ForbiddenException('Role header x-role fehlt');
    }
    if (!requiredRoles.includes(currentRole)) {
      throw new ForbiddenException('Zugriff verweigert für Rolle: ' + currentRole);
    }
    return true;
  }
}