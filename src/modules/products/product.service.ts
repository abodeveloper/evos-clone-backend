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
import { Category, CategoryDocument } from '../category/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.schema';
import * as fs from 'fs/promises';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // 🔹 Barcha mahsulotlarni olish
  async getAll(query: {
    sort?: string;
    fields?: string;
    search?: string;
    filters?: Record<string, any>;
  }): Promise<CustomApiResponse<ProductDocument[]>> {
    const { sort, fields, search, filters = {} } = query;

    // Asosiy so‘rov (tipni aniq belgilash)
    let mongooseQuery: Query<ProductDocument[], ProductDocument> =
      this.productModel.find();

    // Filter qo‘llash
    if (filters && Object.keys(filters).length > 0) {
      const validFields = [
        'name',
        'description',
        'category',
        'price',
        'isDiscounted',
        'discountPrice',
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
      if (
        ![
          'name',
          'description',
          'price',
          'isDiscounted',
          'discountPrice',
          'createdAt',
          'updatedAt',
        ].includes(field)
      ) {
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
        'imagePath',
        'price',
        'isDiscounted',
        'discountPrice',
        'category',
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

    // Category’ni populate qilish
    mongooseQuery = mongooseQuery.populate('category');

    // Ma'lumotlarni olish
    const products = await mongooseQuery.exec();

    return createCustomApiResponse(MessageKeys.FETCHED, products);
  }

  // 🔹 Paginatsiya bilan mahsulotlarni olish
  async getWithPagination(query: {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    search?: string;
    filters?: Record<string, any>;
  }): Promise<CustomApiResponse<PaginationResponse<ProductDocument>>> {
    const { page = 1, limit = 10, sort, fields, search, filters = {} } = query;

    // Pagination sozlamalari
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Asosiy so‘rov (tipni aniq belgilash)
    let mongooseQuery: Query<ProductDocument[], ProductDocument> =
      this.productModel.find();

    // Filter qo‘llash
    if (filters && Object.keys(filters).length > 0) {
      const validFields = [
        'name',
        'description',
        'category',
        'price',
        'isDiscounted',
        'discountPrice',
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
      if (
        ![
          'name',
          'description',
          'price',
          'isDiscounted',
          'discountPrice',
          'createdAt',
          'updatedAt',
        ].includes(field)
      ) {
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
        'imagePath',
        'price',
        'isDiscounted',
        'discountPrice',
        'category',
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

    // Category’ni populate qilish
    mongooseQuery = mongooseQuery.populate('category');

    // Pagination qo‘llash
    mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

    // Jami yozuvlar sonini hisoblash
    const total = await this.productModel
      .countDocuments({ ...mongooseQuery.getQuery() })
      .exec();

    // Ma'lumotlarni olish
    const data = await mongooseQuery.exec();

    // Jami sahifalar sonini hisoblash
    const totalPages = Math.ceil(total / limitNum);

    // Pagination javobini tayyorlash
    const paginationResponse: PaginationResponse<ProductDocument> = {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };

    return createCustomApiResponse(MessageKeys.FETCHED, paginationResponse);
  }

  // 🔹 ID bo'yicha bitta mahsulotni olish
  async getOne(id: string): Promise<CustomApiResponse<ProductDocument>> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.FETCHED, product);
  }

  // 🔹 Yangi mahsulot yaratish
  async create(
    createProductDto: CreateProductDto,
    imagePath: string,
  ): Promise<CustomApiResponse<ProductDocument>> {
    // Kategoriyani tekshirish
    const category = await this.categoryModel
      .findById(createProductDto.category)
      .exec();
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    const productData = {
      ...createProductDto,
      imagePath, // Rasm yo‘li
      category: createProductDto.category,
    };

    const newProduct = new this.productModel(productData);
    const savedProduct = await newProduct.save();

    return createCustomApiResponse(MessageKeys.CREATED, savedProduct);
  }

  // 🔹 Mahsulotni yangilash
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    imagePath?: string,
  ): Promise<CustomApiResponse<ProductDocument>> {
    // Mavjud mahsulotni olish
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    // Agar kategoriya yangilansa, uni tekshirish
    if (updateProductDto.category) {
      const category = await this.categoryModel
        .findById(updateProductDto.category)
        .exec();
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi');
      }
    }

    // Agar isDiscounted false bo‘lsa, discountPrice’ni undefined qilamiz
    if (updateProductDto.isDiscounted === false) {
      updateProductDto.discountPrice = undefined;
    }

    // Agar yangi rasm yuklansa, eski rasmni o‘chirish
    if (imagePath && product.imagePath) {
      try {
        await fs.unlink(product.imagePath);
        console.log(`Eski rasm o‘chirildi: ${product.imagePath}`);
      } catch (err) {
        console.error(`Eski rasmni o‘chirishda xato: ${err}`);
        // Xatolikni log qilamiz, lekin jarayonni to‘xtatmaymiz
      }
      updateProductDto.imagePath = imagePath; // Yangi rasm yo‘lini qo‘shish
    }

    // Mahsulotni yangilash
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.UPDATED, updatedProduct);
  }

  // 🔹 Mahsulotni o'chirish
  async delete(id: string): Promise<CustomApiResponse<ProductDocument>> {
    // Mavjud mahsulotni olish
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    // Agar rasm mavjud bo‘lsa, uni fayl tizimidan o‘chirish
    if (product.imagePath) {
      try {
        await fs.unlink(product.imagePath);
        console.log(`Rasm o‘chirildi: ${product.imagePath}`);
      } catch (err) {
        console.error(`Rasmni o‘chirishda xato: ${err}`);
        // Xatolikni log qilamiz, lekin jarayonni to‘xtatmaymiz
      }
    }

    // Mahsulotni bazadan o‘chirish
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(MESSAGES[MessageKeys.NOT_FOUND]);
    }

    return createCustomApiResponse(MessageKeys.DELETED, deletedProduct);
  }
}
