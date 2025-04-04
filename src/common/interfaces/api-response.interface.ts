import { ApiProperty } from '@nestjs/swagger';

export class CustomApiResponse<T> {
  @ApiProperty({ description: 'Muvaffaqiyat holati', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Xabar',
    example: "Ma'lumotlar muvaffaqiyatli olingan",
  })
  message: string;

  @ApiProperty({ description: "Ma'lumotlar" })
  data: T;

  @ApiProperty({ description: "Qo'shimcha ma'lumotlar", required: false })
  metadata?: Record<string, any>;
}
