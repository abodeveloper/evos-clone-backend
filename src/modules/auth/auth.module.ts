import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '../jwt/jwt.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtAuthModule,
    MailModule,
    UsersModule,
    ConfigModule,
    CacheModule.register(),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
