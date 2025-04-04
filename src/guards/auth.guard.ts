import { JwtService } from '@/modules/jwt/jwt.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token topilmadi');
    }

    try {
      const payload = this.jwtService.verifyToken(token);
      request['user'] = payload; // Foydalanuvchi ma'lumotlarini requestga qo'shish
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Yaroqsiz token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
