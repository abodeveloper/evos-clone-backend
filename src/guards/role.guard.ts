import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // @Roles dekoratoridan talab qilinadigan rollarni olish
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar hech qanday rol talab qilinmasa, ruxsat berish
    if (!requiredRoles) {
      return true;
    }

    // Request obyektidan foydalanuvchi ma'lumotlarini olish
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as any;

    // Foydalanuvchi yoki uning roli mavjud emasligini tekshirish
    if (!user || !user.role) {
      throw new ForbiddenException('Foydalanuvchi roliga ega emas');
    }

    // Foydalanuvchining roli talab qilinadigan rollar ichida bor-yo‘qligini tekshirish
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Sizda bu resursga kirish huquqi yo‘q');
    }

    return true;
  }
}
