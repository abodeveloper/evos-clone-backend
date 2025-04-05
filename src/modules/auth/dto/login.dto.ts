import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, example: 'admin' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true, example: 'admin_password' })
  @IsNotEmpty()
  password: string;
}
