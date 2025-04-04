import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

/**
 * GET / endpointlari uchun umumiy Swagger dekorator.
 * search, sort query parametrlari va ApiOperation qaytaradi.
 * @param summary - Endpointning Swagger UI’da ko‘rinadigan tavsifi (ixtiyoriy)
 * @returns ApiQuery va ApiOperation dekoratorlari
 */
export function ApiGetAllQueries(
  summary: string = 'Barcha maʼlumotlarni olish',
) {
  return applyDecorators(
    ApiOperation({ summary }), // Endpointning tavsifi
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
    ApiQuery({
      name: 'sort',
      required: false,
      description: 'Tartiblash tartibi (field:order, masalan, name:asc)',
      example: 'name:asc',
    }),
  );
}
