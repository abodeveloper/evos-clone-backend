import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

// Filtr parametri uchun interfeys
interface FilterQueryParam {
  name: string;
  description?: string; // description ixtiyoriy
  required?: boolean; // required ixtiyoriy va boshlang‘ich qiymati false
  example?: any;
  type?: any;
}

/**
 * Filtr parametrlari uchun moslashuvchan Swagger dekorator.
 * Berilgan filtr parametrlarni ApiQuery dekoratorlari sifatida qaytaradi.
 * @param filters - Filtr parametrlari ro‘yxati
 * @returns ApiQuery dekoratorlari
 */
export function ApiFilterQueries(filters: FilterQueryParam[]) {
  return applyDecorators(
    ...filters.map((filter) =>
      ApiQuery({
        name: filter.name,
        required: filter.required ?? false, // Boshlang‘ich qiymat false
        description: filter.description ?? 'Filtr parametri', // Agar description kiritilmasa, standart qiymat
        ...(filter.example ? { example: filter.example } : {}),
        ...(filter.type ? { type: filter.type } : {}),
      }),
    ),
  );
}
