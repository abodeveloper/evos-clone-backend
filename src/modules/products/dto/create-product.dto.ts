import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Mahsulot nomi', example: 'Smartfon' })
  @IsString()
  @IsNotEmpty({ message: 'Mahsulot nomi majburiy' })
  name: string;

  @ApiProperty({
    description: 'Mahsulot tavsifi',
    example: 'Bu yangi smartfon modeli',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mahsulot tavsifi majburiy' })
  description: string;

  @ApiProperty({ description: 'Mahsulot narxi', example: 500 })
  @IsNumber({}, { message: 'Narx raqam bo‘lishi kerak' })
  @Min(0, { message: 'Narx 0 dan kichik bo‘lmasligi kerak' })
  @IsNotEmpty({ message: 'Narx majburiy' })
  price: number;

  @ApiProperty({ description: 'Skidka bor yoki yo‘qligi', example: false })
  @IsBoolean({ message: 'Skidka holati "true" yoki "false" bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Skidka holati majburiy' })
  isDiscounted: boolean;

  @ApiProperty({
    description: 'Skidka narxi (agar skidka bo‘lsa)',
    example: 400,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Skidka narxi raqam bo‘lishi kerak' })
  @Min(0, { message: 'Skidka narxi 0 dan kichik bo‘lmasligi kerak' })
  @ValidateIf((o) => o.isDiscounted === true, {
    message: 'Skidka bo‘lganda skidka narxi majburiy',
  })
  discountPrice?: number;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi ID’si',
    example: '60d5f484f1b2c123456789ab',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kategoriya majburiy' })
  category: string;
}
