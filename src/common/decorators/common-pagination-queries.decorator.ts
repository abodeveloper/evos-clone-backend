import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

/**
 * Pagination uchun umumiy query parametrlari va operation uchun Swagger dekorator.
 * page, limit, sort, fields, va search parametrlari uchun ApiQuery dekoratorlari va ApiOperation qaytaradi.
 * @returns ApiQuery va ApiOperation dekoratorlari
 */
export function ApiCommonPaginationQueries(
  summary: string = 'Barcha maʼlumotlarni pagination bilan olish',
) {
  return applyDecorators(
    ApiOperation({
      summary,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Sahifa raqami',
      example: 1,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Har bir sahifadagi yozuvlar soni',
      example: 10,
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description: 'Tartiblash tartibi (field:order, masalan, name:asc)',
      example: 'name:asc',
    }),
    ApiQuery({
      name: 'fields',
      required: false,
      description:
        'Qaytariladigan field’lar (vergul bilan ajratilgan, masalan, name,description)',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Qidiruv (name, description bo‘yicha qidiradi)',
    }),
  );
}
