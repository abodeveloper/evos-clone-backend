import { Query } from 'mongoose';
import { QueryStringInterface, ResponsePaginationData } from './base.interface';

export class APIFeatures<T> {
  mongooseQuery: Query<T[], T>;
  countQuery: Query<number, T>;
  queryString: QueryStringInterface;

  constructor(
    mongooseQuery: Query<T[], T>,
    countQuery: Query<number, T>,
    queryString: QueryStringInterface,
  ) {
    this.mongooseQuery = mongooseQuery;
    this.countQuery = countQuery;
    this.queryString = queryString;
  }

  filter(searchFields: string[]): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|or|nin|in)\b/g,
      (match) => `$${match}`,
    );

    const query = JSON.parse(queryStr);

    if (this.queryString.search) {
      const searchValue = this.queryString.search.trim(); // Bo'sh joylarni olib tashlash (as string olib tashlandi)
      if (searchValue) {
        const searchRegex = new RegExp(
          searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ); // Maxsus belgilar uchun escape
        query['$or'] = searchFields.map((field) => ({
          [field]: { $regex: searchRegex },
        }));
      }
    }

    this.mongooseQuery = this.mongooseQuery.find(query);
    this.countQuery = this.countQuery.countDocuments(query);

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }

    return this;
  }

  selectFields(selectFields?: string): this {
    if (selectFields) {
      const fields = selectFields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }

    return this;
  }

  pagination(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  async getResults(): Promise<{
    data: T[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.mongooseQuery.exec(),
      this.countQuery.exec(),
    ]);

    return {
      data,
      total,
    };
  }

  async getResultsPagination(): Promise<ResponsePaginationData<T>> {
    const [data, total] = await Promise.all([
      this.mongooseQuery.exec(),
      this.countQuery.exec(),
    ]);

    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
