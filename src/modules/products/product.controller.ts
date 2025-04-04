import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './product.schema';
import { CustomApiResponse } from '@/common/interfaces/api-response.interface';
import { PaginationResponse } from '@/common/interfaces/pagination-response.interface';
import { multerConfig } from '@/common/config/multer.config';
import { ApiCommonPaginationQueries } from '@/common/decorators/common-pagination-queries.decorator';
import { ApiFilterQueries } from '@/common/decorators/filter-queries.decorator';
import { ApiGetAllQueries } from '@/common/decorators/get-all-queries.decorator';
import { Roles } from '@/guards/decorators/roles.decorator';
import { Role } from '@/enums/role.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { RoleGuard } from '@/guards/role.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Yangi mahsulot yaratish (faqat ADMIN uchun)
   * @param createProductDto - Mahsulot yaratish uchun ma'lumotlar
   * @param file - Yuklangan rasm fayli
   * @returns Yaratilgan mahsulot
   */
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi mahsulot yaratish (ADMIN uchun)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mahsulot maʼlumotlari va rasm fayli',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Smartfon' },
        description: { type: 'string', example: 'Bu yangi smartfon modeli' },
        price: { type: 'number', example: 500 },
        isDiscounted: { type: 'boolean', example: false },
        discountPrice: { type: 'number', example: 400, nullable: true },
        category: { type: 'string', example: '60d5f484f1b2c123456789ab' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Mahsulot muvaffaqiyatli yaratildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token topilmadi yoki yaroqsiz',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Faqat ADMIN ruxsatiga ega foydalanuvchilar uchun',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomApiResponse<ProductDocument>> {
    if (!file) {
      throw new BadRequestException('Rasm fayli majburiy!');
    }
    const imagePath = file.path;
    return this.productService.create(createProductDto, imagePath);
  }

  /**
   * Barcha mahsulotlarni olish
   * @param query - Filtr, qidiruv va tartiblash parametrlari
   * @returns Mahsulotlar ro‘yxati
   */
  @Get()
  @ApiGetAllQueries('Barcha mahsulotlarni olish')
  @ApiFilterQueries([
    { name: 'name', description: 'Mahsulot nomi bo‘yicha filtr qilish' },
    {
      name: 'description',
      description: 'Mahsulot tavsifi bo‘yicha filtr qilish',
    },
    { name: 'category', description: 'Kategoriya ID’si bo‘yicha filtr qilish' },
    { name: 'price', description: 'Narx bo‘yicha filtr qilish' },
    {
      name: 'isDiscounted',
      description: 'Skidka bor yoki yo‘qligi bo‘yicha filtr qilish',
    },
    {
      name: 'discountPrice',
      description: 'Skidka narxi bo‘yicha filtr qilish',
    },
    {
      name: 'createdAt',
      description: 'Yaratilgan vaqti bo‘yicha filtr qilish',
    },
    {
      name: 'updatedAt',
      description: 'Yangilangan vaqti bo‘yicha filtr qilish',
    },
  ])
  @ApiResponse({
    status: 200,
    description: 'Mahsulotlar muvaffaqiyatli olindi',
    type: () => CustomApiResponse,
  })
  async getAll(
    @Query()
    query: {
      sort?: string;
      fields?: string;
      search?: string;
      name?: string;
      description?: string;
      category?: string;
      price?: string;
      isDiscounted?: string;
      discountPrice?: string;
      createdAt?: string;
      updatedAt?: string;
    },
  ): Promise<CustomApiResponse<ProductDocument[]>> {
    const filters: Record<string, any> = {};

    if (query.name) filters.name = query.name;
    if (query.description) filters.description = query.description;
    if (query.createdAt) filters.createdAt = query.createdAt;
    if (query.updatedAt) filters.updatedAt = query.updatedAt;
    if (query.category) filters.category = query.category;
    if (query.price) filters.price = query.price;
    if (query.isDiscounted)
      filters.isDiscounted = query.isDiscounted === 'true';
    if (query.discountPrice) filters.discountPrice = query.discountPrice;

    return this.productService.getAll({ ...query, filters });
  }

  /**
   * Mahsulotlarni paginatsiya bilan olish (faqat ADMIN uchun)
   * @param query - Paginatsiya, filtr va qidiruv parametrlari
   * @returns Paginatsiya qilingan mahsulotlar ro‘yxati
   */
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('pagination')
  @ApiBearerAuth()
  @ApiCommonPaginationQueries()
  @ApiFilterQueries([
    { name: 'name', description: 'Mahsulot nomi bo‘yicha filtr qilish' },
    {
      name: 'description',
      description: 'Mahsulot tavsifi bo‘yicha filtr qilish',
    },
    { name: 'category', description: 'Kategoriya ID’si bo‘yicha filtr qilish' },
    { name: 'price', description: 'Narx bo‘yicha filtr qilish' },
    {
      name: 'isDiscounted',
      description: 'Skidka bor yoki yo‘qligi bo‘yicha filtr qilish',
    },
    {
      name: 'discountPrice',
      description: 'Skidka narxi bo‘yicha filtr qilish',
    },
    {
      name: 'createdAt',
      description: 'Yaratilgan vaqti bo‘yicha filtr qilish',
    },
    {
      name: 'updatedAt',
      description: 'Yangilangan vaqti bo‘yicha filtr qilish',
    },
  ])
  @ApiResponse({
    status: 200,
    description: 'Mahsulotlar muvaffaqiyatli olindi',
    type: () => CustomApiResponse<PaginationResponse<ProductDocument>>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token topilmadi yoki yaroqsiz',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Faqat ADMIN ruxsatiga ega foydalanuvchilar uchun',
  })
  async getWithPagination(
    @Query()
    query: {
      page?: number;
      limit?: number;
      sort?: string;
      fields?: string;
      search?: string;
      name?: string;
      description?: string;
      category?: string;
      price?: string;
      isDiscounted?: string;
      discountPrice?: string;
      createdAt?: string;
      updatedAt?: string;
    },
  ): Promise<CustomApiResponse<PaginationResponse<ProductDocument>>> {
    const filters: Record<string, any> = {};
    if (query.name) filters.name = query.name;
    if (query.description) filters.description = query.description;
    if (query.createdAt) filters.createdAt = query.createdAt;
    if (query.updatedAt) filters.updatedAt = query.updatedAt;
    if (query.category) filters.category = query.category;
    if (query.price) filters.price = query.price;
    if (query.isDiscounted)
      filters.isDiscounted = query.isDiscounted === 'true';
    if (query.discountPrice) filters.discountPrice = query.discountPrice;

    return this.productService.getWithPagination({ ...query, filters });
  }

  /**
   * Mahsulotni ID bo‘yicha olish
   * @param id - Mahsulot ID’si
   * @returns Mahsulot
   */
  @Get(':id')
  @ApiOperation({ summary: 'Mahsulotni ID bo‘yicha olish' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli olindi',
    type: () => CustomApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  async getById(
    @Param('id') id: string,
  ): Promise<CustomApiResponse<ProductDocument>> {
    return this.productService.getOne(id);
  }

  /**
   * Mahsulotni yangilash (faqat ADMIN uchun)
   * @param id - Mahsulot ID’si
   * @param updateProductDto - Yangilash uchun ma'lumotlar
   * @param file - Yangi rasm fayli (ixtiyoriy)
   * @returns Yangilangan mahsulot
   */
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mahsulotni yangilash (ADMIN uchun)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mahsulot maʼlumotlari va rasm fayli (ixtiyoriy)',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Smartfon', nullable: true },
        description: {
          type: 'string',
          example: 'Bu yangi smartfon modeli',
          nullable: true,
        },
        price: { type: 'number', example: 500, nullable: true },
        isDiscounted: { type: 'boolean', example: false, nullable: true },
        discountPrice: { type: 'number', example: 400, nullable: true },
        category: {
          type: 'string',
          example: '60d5f484f1b2c123456789ab',
          nullable: true,
        },
        file: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli yangilandi',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token topilmadi yoki yaroqsiz',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Faqat ADMIN ruxsatiga ega foydalanuvchilar uchun',
  })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CustomApiResponse<ProductDocument>> {
    const imagePath = file ? file.path : undefined;
    return this.productService.update(id, updateProductDto, imagePath);
  }

  /**
   * Mahsulotni o‘chirish (faqat ADMIN uchun)
   * @param id - Mahsulot ID’si
   * @returns O‘chirilgan mahsulot
   */
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mahsulotni o‘chirish (ADMIN uchun)' })
  @ApiResponse({
    status: 200,
    description: 'Mahsulot muvaffaqiyatli o‘chirildi',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token topilmadi yoki yaroqsiz',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Faqat ADMIN ruxsatiga ega foydalanuvchilar uchun',
  })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  async delete(
    @Param('id') id: string,
  ): Promise<CustomApiResponse<ProductDocument>> {
    return this.productService.delete(id);
  }
}
