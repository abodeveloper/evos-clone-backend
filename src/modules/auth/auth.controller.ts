import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchi ro‘yxatdan o‘tkazish' })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
  })
  @ApiResponse({
    status: 400,
    description: 'Username yoki email allaqachon mavjud',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Emailni tasdiqlash' })
  @ApiResponse({ status: 200, description: 'Email muvaffaqiyatli tasdiqlandi' })
  @ApiResponse({
    status: 400,
    description: 'Noto‘g‘ri email yoki tasdiqlash kodi',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.code, 
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchi tizimga kirish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirish' })
  @ApiResponse({
    status: 401,
    description: 'Username yoki parol noto‘g‘ri yoki email tasdiqlanmagan',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
