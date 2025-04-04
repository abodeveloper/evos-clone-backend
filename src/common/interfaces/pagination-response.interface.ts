import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty({ description: "Ma'lumotlar ro'yxati" })
  data: T[];

  @ApiProperty({ description: "Jami ma'lumotlar soni", example: 100 })
  total: number;

  @ApiProperty({ description: 'Joriy sahifa raqami', example: 1 })
  page: number;

  @ApiProperty({
    description: "Har bir sahifadagi ma'lumotlar soni",
    example: 10,
  })
  limit: number;

  @ApiProperty({ description: 'Jami sahifalar soni', example: 10 })
  totalPages: number;
}
