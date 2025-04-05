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
  @IsString({ message: 'Mahsulot nomi string bo‘lishi kerak' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Mahsulot tavsifi',
    example: 'Bu yangi smartfon modeli',
    required: false,
  })
  @IsString({ message: 'Mahsulot tavsifi string bo‘lishi kerak' })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Mahsulot narxi', example: 500, required: false })
  @IsNumber({}, { message: 'Narx raqam bo‘lishi kerak' })
  @Min(0, { message: 'Narx 0 dan kichik bo‘lmasligi kerak' })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Skidka bor yoki yo‘qligi',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Skidka holati "true" yoki "false" bo‘lishi kerak' })
  @IsOptional()
  isDiscounted?: boolean;

  @ApiProperty({
    description: 'Skidka narxi (agar skidka bo‘lsa)',
    example: 400,
    required: false,
  })
  @IsNumber({}, { message: 'Skidka narxi raqam bo‘lishi kerak' })
  @Min(0, { message: 'Skidka narxi 0 dan kichik bo‘lmasligi kerak' })
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
  @IsString({ message: 'Kategoriya ID string bo‘lishi kerak' })
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Rasm yo‘li',
    example: 'uploads/images/product-123.jpg',
    required: false,
  })
  @IsString({ message: 'Rasm yo‘li string bo‘lishi kerak' })
  @IsOptional()
  imagePath?: string;
}
