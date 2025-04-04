import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Mahsulot nomi', example: 'Smartfon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mahsulot tavsifi',
    example: 'Bu yangi smartfon modeli',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Mahsulot narxi', example: 500 })
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new Error('price must be a number greater than or equal to 0');
    }
    return num;
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Skidka bor yoki yo‘qligi', example: false })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      throw new Error(
        'isDiscounted is required and must be a boolean value ("true" or "false")',
      );
    }
    const normalizedValue = String(value).toLowerCase();
    if (normalizedValue === 'true') return true;
    if (normalizedValue === 'false') return false;
    throw new Error('isDiscounted must be a boolean value ("true" or "false")');
  })
  @IsNotEmpty()
  isDiscounted: boolean;

  @ApiProperty({
    description: 'Skidka narxi (agar skidka bo‘lsa)',
    example: 400,
    required: false,
  })
  @ValidateIf((o) => o.isDiscounted === true)
  @Transform(({ value }) => {
    if (!value) return undefined;
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new Error(
        'discountPrice must be a number greater than or equal to 0',
      );
    }
    return num;
  })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi ID’si',
    example: '60d5f484f1b2c123456789ab',
  })
  @IsString()
  @IsNotEmpty()
  category: string;
}
