/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { APIFeatures } from './api-features';

@Injectable()
export abstract class BaseService<T> {
  constructor(protected readonly model: Model<T>) {}

  async findAllWithPagination(
    queryString: { [key: string]: string | number | undefined },
    searchFields: string[],
    selectFields?: string,
    transformFn?: (item: T) => T,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const features = new APIFeatures<T>(
      this.model.find(),
      this.model.countDocuments(),
      queryString,
    )
      .filter(searchFields)
      .sort()
      .selectFields(selectFields)
      .pagination();

    const result = await features.getResultsPagination();

    const data: T[] = transformFn
      ? result.data.map((item) => transformFn(item))
      : result.data;

    return {
      ...result,
      data,
    };
  }

  async findAll(
    queryString: { [key: string]: string | number | undefined },
    searchFields: string[],
    selectFields?: string,
    transformFn?: (item: T) => T,
  ): Promise<{
    data: T[];
    total: number;
  }> {
    const features = new APIFeatures<T>(
      this.model.find(),
      this.model.countDocuments(),
      queryString,
    )
      .filter(searchFields)
      .sort()
      .selectFields(selectFields);

    const result = await features.getResults();

    const data: T[] = transformFn
      ? result.data.map((item) => transformFn(item))
      : result.data;

    return {
      ...result,
      data,
    };
  }

  async findOne(id: string, transformFn?: (item: T) => T): Promise<T> {
    const item = await this.model.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`${this.model.modelName} topilmadi`);
    }
    return transformFn ? transformFn(item) : item;
  }

  async create(createDto: any, transformFn?: (item: T) => T): Promise<T> {
    const newItem = new this.model(createDto);
    await newItem.save();
    return transformFn ? transformFn(newItem) : newItem;
  }

  async update(
    id: string,
    updateDto: any,
    transformFn?: (item: T) => T,
  ): Promise<T> {
    const item = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .exec();
    if (!item) {
      throw new NotFoundException(`${this.model.modelName} topilmadi`);
    }
    return transformFn ? transformFn(item) : item;
  }

  async remove(id: string): Promise<T> {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) {
      throw new NotFoundException(`${this.model.modelName} topilmadi`);
    }
    return item;
  }

  async count(query: any = {}): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  //   async aggregate(
  //     pipeline: any[],
  //     transformFn?: (item: any) => T,
  //   ): Promise<T[]> {
  //     const results = await this.model.aggregate(pipeline).exec();
  //     return transformFn ? results.map(transformFn) : results;
  //   }

  async findOneWithPopulate(
    id: string,
    populateFields: string[],
    transformFn?: (item: T) => T,
  ): Promise<T> {
    let query = this.model.findById(id);
    populateFields.forEach((field) => {
      query = query.populate(field);
    });
    const item = await query.exec();
    if (!item) {
      throw new NotFoundException(`${this.model.modelName} topilmadi`);
    }
    return transformFn ? transformFn(item) : item;
  }

  async findOneByCondition(
    conditions: any,
    transformFn?: (item: T) => T,
  ): Promise<T | null> {
    const item = await this.model.findOne(conditions).exec();
    if (!item) return null;
    return transformFn ? transformFn(item) : item;
  }

  async findByCondition(
    conditions: any,
    transformFn?: (item: T) => T,
  ): Promise<T[]> {
    const items = await this.model.find(conditions).exec();
    return transformFn ? items.map(transformFn) : items;
  }

  async exists(conditions: any): Promise<boolean> {
    const count = await this.model.countDocuments(conditions).exec();
    return count > 0;
  }
}
