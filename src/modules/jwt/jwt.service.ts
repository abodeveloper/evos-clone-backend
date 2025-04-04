import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private jwt: NestJwtService) {}

  generateToken(payload: object): string {
    return this.jwt.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwt.verify(token);
  }
}
