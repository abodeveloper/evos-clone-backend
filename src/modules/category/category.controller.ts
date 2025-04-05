import { CustomApiResponse } from '@/common/interfaces/api-response.interface';
import { PaginationResponse } from '@/common/interfaces/pagination-response.interface';
import { Role } from '@/enums/role.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { Roles } from '@/guards/decorators/roles.decorator';
import { RoleGuard } from '@/guards/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CategoryDocument as ResourceDocument } from './category.schema';
import { CategoryService as ResourceService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiCommonPaginationQueries } from '@/common/decorators/common-pagination-queries.decorator';
import { ApiFilterQueries } from '@/common/decorators/filter-queries.decorator';
import { ApiGetAllQueries } from '@/common/decorators/get-all-queries.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly resourceService: ResourceService) {}

  // Get all data
  @Get()
  @ApiFilterQueries([
    {
      name: 'name',
    },
    {
      name: 'description',
    },
    {
      name: 'createdAt',
    },
    {
      name: 'updatedAt',
    },
  ])
  @ApiGetAllQueries()
  @ApiResponse({ status: 200, type: CustomApiResponse })
  async getAll(
    @Query()
    query: {
      sort?: string;
      fields?: string;
      search?: string;
      name?: string;
      description?: string;
      createdAt?: string;
      updatedAt?: string;
    },
  ): Promise<CustomApiResponse<ResourceDocument[]>> {
    const filters: Record<string, any> = {};

    if (query.name) filters.name = query.name;
    if (query.description) filters.description = query.description;
    if (query.createdAt) filters.createdAt = query.createdAt;
    if (query.updatedAt) filters.updatedAt = query.updatedAt;

    return this.resourceService.getAll({ ...query, filters });
  }

  // Get data with pagination
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('pagination')
  @ApiBearerAuth() // Autentifikatsiya talab qilinadi
  @ApiFilterQueries([
    {
      name: 'name',
    },
    {
      name: 'description',
    },
    {
      name: 'createdAt',
    },
    {
      name: 'updatedAt',
    },
  ])
  @ApiCommonPaginationQueries()
  @ApiResponse({
    status: 200,
    description: 'Resurslar muvaffaqiyatli olindi',
    type: () => CustomApiResponse<PaginationResponse<ResourceDocument>>,
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
      createdAt?: string;
      updatedAt?: string;
    },
  ): Promise<CustomApiResponse<PaginationResponse<ResourceDocument>>> {
    const filters: Record<string, any> = {};
    if (query.name) filters.name = query.name;
    if (query.description) filters.description = query.description;
    if (query.createdAt) filters.createdAt = query.createdAt;
    if (query.updatedAt) filters.updatedAt = query.updatedAt;

    return this.resourceService.getWithPagination({ ...query, filters });
  }

  // Get one
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    return this.resourceService.getOne(id);
  }

  // Create
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createResourceDto: CreateCategoryDto,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    return this.resourceService.create(createResourceDto);
  }

  // Update
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateCategoryDto,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    return this.resourceService.update(id, updateResourceDto);
  }

  // Delete
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    return this.resourceService.delete(id);
  }
}
