import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { Category, CategorySchema } from '../category/category.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [
    JwtAuthModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
