import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
