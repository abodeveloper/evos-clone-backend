import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @MinLength(6)
  password: string;
}
