import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  imagePath: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: false })
  isDiscounted: boolean;

  @Prop({ min: 0 }) // required sharti olib tashlandi, default null olib tashlandi
  discountPrice?: number; // Faqat number turi, null emas

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Schema validatsiyasi: discountPrice faqat isDiscounted true bo‘lganda majburiy
ProductSchema.pre('validate', function (next) {
  if (
    this.isDiscounted &&
    (this.discountPrice === undefined || this.discountPrice === null)
  ) {
    next(
      new Error(
        'Skidka narxi (discountPrice) majburiy, chunki isDiscounted true',
      ),
    );
  } else if (!this.isDiscounted) {
    this.discountPrice = undefined; // Agar skidka yo‘q bo‘lsa, discountPrice undefined bo‘ladi
  }
  next();
});
