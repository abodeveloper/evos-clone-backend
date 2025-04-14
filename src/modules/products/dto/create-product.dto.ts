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
  @ApiProperty({ description: 'Mahsulot nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mahsulot tavsifi',
    example: 'Bu yangi mahsulot',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Mahsulot narxi' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Skidka bor yoki yo‘qligi', example: false })
  @IsBoolean()
  @IsNotEmpty()
  isDiscounted: boolean;

  @ApiProperty({
    description: 'Skidka narxi (agar skidka bo‘lsa)',
    example: 34000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.isDiscounted === true, {
    message: 'Skidka bo‘lganda skidka narxi majburiy',
  })
  discountPrice?: number;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi ID’si',
  })
  @IsString()
  @IsNotEmpty()
  category: string;
}
