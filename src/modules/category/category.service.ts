import { MessageKeys, MESSAGES } from '@/common/constants/messages';
import { CustomApiResponse } from '@/common/interfaces/api-response.interface';
import { PaginationResponse } from '@/common/interfaces/pagination-response.interface';
import { createCustomApiResponse } from '@/common/utils/api-response.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import {
  Category as Resource,
  CategoryDocument as ResourceDocument,
} from './category.schema'; // Resource sifatida o‘zgartirildi
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Resource.name)
    private resourceModel: Model<ResourceDocument>,
  ) {}

  // 🔹 Barcha resurslarni olish
  async getAll(query: {
    sort?: string;
    fields?: string;
    search?: string;
    filters?: Record<string, any>;
  }): Promise<CustomApiResponse<ResourceDocument[]>> {
    const { sort, fields, search, filters = {} } = query;

    // Asosiy so‘rov (tipni aniq belgilash)
    let mongooseQuery: Query<ResourceDocument[], ResourceDocument> =
      this.resourceModel.find();

    // Filter qo‘llash
    if (filters && Object.keys(filters).length > 0) {
      const validFields = [
        'name',
        'description',
        'category',
        'createdAt',
        'updatedAt',
      ];
      const invalidFields = Object.keys(filters).filter(
        (field) => !validFields.includes(field),
      );
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Noto‘g‘ri field’lar: ${invalidFields.join(', ')}. Ruxsat etilgan field’lar: ${validFields.join(', ')}`,
        );
      }
      mongooseQuery = mongooseQuery.find(filters);
    }

    // Search qo‘llash
    if (search) {
      const searchFields = ['name', 'description'];
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: searchRegex },
      }));
      mongooseQuery = mongooseQuery.or(searchConditions);
    }

    // Sorting qo‘llash
    if (sort) {
      const [field, order] = sort.split(':');
      if (!['name', 'description', 'createdAt', 'updatedAt'].includes(field)) {
        throw new BadRequestException(`Noto‘g‘ri sort field: ${field}`);
      }
      if (!['asc', 'desc'].includes(order)) {
        throw new BadRequestException(`Noto‘g‘ri sort order: ${order}`);
      }
      const sortOrder = order === 'desc' ? -1 : 1;
      mongooseQuery = mongooseQuery.sort({ [field]: sortOrder });
    }

    // Field selection qo‘llash
    if (fields) {
      const validFields = [
        'name',
        'description',
        'createdAt',
        'updatedAt',
        '_id',
      ];
      const selectedFields = fields.split(',').map((field) => field.trim());
      const invalidFields = selectedFields.filter(
        (field) => !validFields.includes(field),
      );
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Noto‘g‘ri fields: ${invalidFields.join(', ')}. Ruxsat etilgan field’lar: ${validFields.join(', ')}`,
        );
      }
      mongooseQuery = mongooseQuery.select(selectedFields.join(' '));
    }

    // Ma'lumotlarni olish
    const resources = await mongooseQuery.exec();

    return createCustomApiResponse(MessageKeys.FETCHED, resources);
  }

  // 🔹 Paginatsiya bilan resurslarni olish
  async getWithPagination(query: {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    search?: string;
    filters?: Record<string, any>;
  }): Promise<CustomApiResponse<PaginationResponse<ResourceDocument>>> {
    const { page = 1, limit = 10, sort, fields, search, filters = {} } = query;

    // Pagination sozlamalari
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Asosiy so‘rov (tipni aniq belgilash)
    let mongooseQuery: Query<ResourceDocument[], ResourceDocument> =
      this.resourceModel.find();

    // Filter qo‘llash
    if (filters && Object.keys(filters).length > 0) {
      const validFields = [
        'name',
        'description',
        'category',
        'createdAt',
        'updatedAt',
      ];
      const invalidFields = Object.keys(filters).filter(
        (field) => !validFields.includes(field),
      );
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Noto‘g‘ri field’lar: ${invalidFields.join(', ')}. Ruxsat etilgan field’lar: ${validFields.join(', ')}`,
        );
      }
      mongooseQuery = mongooseQuery.find(filters);
    }

    // Search qo‘llash
    if (search) {
      const searchFields = ['name', 'description'];
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: searchRegex },
      }));
      mongooseQuery = mongooseQuery.or(searchConditions);
    }

    // Sorting qo‘llash
    if (sort) {
      const [field, order] = sort.split(':');
      if (!['name', 'description', 'createdAt', 'updatedAt'].includes(field)) {
        throw new BadRequestException(`Noto‘g‘ri sort field: ${field}`);
      }
      if (!['asc', 'desc'].includes(order)) {
        throw new BadRequestException(`Noto‘g‘ri sort order: ${order}`);
      }
      const sortOrder = order === 'desc' ? -1 : 1;
      mongooseQuery = mongooseQuery.sort({ [field]: sortOrder });
    }

    // Field selection qo‘llash
    if (fields) {
      const validFields = [
        'name',
        'description',
        'createdAt',
        'updatedAt',
        '_id',
      ];
      const selectedFields = fields.split(',').map((field) => field.trim());
      const invalidFields = selectedFields.filter(
        (field) => !validFields.includes(field),
      );
      if (invalidFields.length > 0) {
        throw new BadRequestException(
          `Noto‘g‘ri fields: ${invalidFields.join(', ')}. Ruxsat etilgan field’lar: ${validFields.join(', ')}`,
        );
      }
      mongooseQuery = mongooseQuery.select(selectedFields.join(' '));
    }

    // Pagination qo‘llash
    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    // Jami yozuvlar sonini hisoblash
    const total = await this.resourceModel
      .countDocuments({ ...mongooseQuery.getQuery() })
      .exec();

    // Ma'lumotlarni olish
    const data = await mongooseQuery.exec();

    // Jami sahifalar sonini hisoblash
    const totalPages = Math.ceil(total / limitNum);

    // Pagination javobini tayyorlash
    const paginationResponse: PaginationResponse<ResourceDocument> = {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };

    return createCustomApiResponse(MessageKeys.FETCHED, paginationResponse);
  }

  // 🔹 ID bo'yicha bitta resursni olish
  async getOne(id: string): Promise<CustomApiResponse<ResourceDocument>> {
    const resource = await this.resourceModel.findById(id).exec();
    if (!resource) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.FETCHED, resource);
  }

  // 🔹 Yangi resurs yaratish
  async create(
    createResourceDto: CreateCategoryDto,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    const newResource = new this.resourceModel(createResourceDto);
    const savedResource = await newResource.save();

    return createCustomApiResponse(MessageKeys.CREATED, savedResource);
  }

  // 🔹 Resursni yangilash
  async update(
    id: string,
    updateResourceDto: UpdateCategoryDto,
  ): Promise<CustomApiResponse<ResourceDocument>> {
    const updatedResource = await this.resourceModel
      .findByIdAndUpdate(id, updateResourceDto, { new: true })
      .exec();

    if (!updatedResource) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.UPDATED, updatedResource);
  }

  // 🔹 Resursni o'chirish
  async delete(id: string): Promise<CustomApiResponse<ResourceDocument>> {
    const deletedResource = await this.resourceModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedResource) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.DELETED, deletedResource);
  }
}
