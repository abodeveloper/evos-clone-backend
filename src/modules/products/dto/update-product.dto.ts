import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Skidka bor yoki yo‘qligi',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDiscounted?: boolean;

  @ApiProperty({
    description: 'Skidka narxi (agar skidka bo‘lsa)',
    example: 400,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.isDiscounted === true, {
    message: 'Skidka bo‘lganda skidka narxi kiritilishi kerak',
  })
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
