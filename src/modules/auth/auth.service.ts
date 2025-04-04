/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { CachedUser } from './interfaces/cached-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // ✅ Inject qilish
  ) {}

  async register(username: string, email: string, password: string) {
    const existingUserByUsername =
      await this.usersService.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Bu email allaqachon mavjud');
    }

    const existingUserByEmail = await this.usersService.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Bu username allaqachon mavjud');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const codeTtl = Number(this.configService.get<number>('CODE_TTL'));

    await this.cacheManager.set(
      `verify:${email}`,
      { username, email, password, code: verificationCode },
      codeTtl,
    );

    await this.mailService.sendVerificationEmail(email, verificationCode);

    return { message: 'Emailingizga tasdiqlash kodi yuborildi' };
  }

  async verifyEmail(email: string, code: string) {
    const cachedUser = (await this.cacheManager.get(
      `verify:${email}`,
    )) as CachedUser;

    if (!cachedUser) {
      throw new UnauthorizedException(
        'Tasdiqlash kodi eskirgan, qayta ro‘yxatdan o‘ting',
      );
    }

    if (cachedUser.code !== code) {
      throw new UnauthorizedException('Kod noto‘g‘ri');
    }

    await this.usersService.createUser({
      username: cachedUser.username,
      email: cachedUser.email,
      password: cachedUser.password,
    });

    await this.cacheManager.del(`verify:${email}`);

    return { message: 'Email muvaffaqiyatli tasdiqlandi' };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Parol noto‘g‘ri');

    const token = this.jwtService.generateToken({
      sub: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return { access_token: token };
  }
}
