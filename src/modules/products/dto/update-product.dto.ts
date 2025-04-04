import { IsString, IsOptional, ValidateIf, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Mahsulot nomi',
    example: 'Smartfon',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Mahsulot tavsifi',
    example: 'Bu yangi smartfon modeli',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Mahsulot narxi', example: 500, required: false })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new Error('price must be a number greater than or equal to 0');
    }
    return num;
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Skidka bor yoki yo‘qligi',
    example: false,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const normalizedValue = String(value).toLowerCase();
    if (normalizedValue === 'true') return true;
    if (normalizedValue === 'false') return false;
    throw new Error('isDiscounted must be a boolean value ("true" or "false")');
  })
  @IsOptional()
  isDiscounted?: boolean;

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
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Rasm yo‘li',
    example: 'uploads/images/product-123.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imagePath?: string;
}
