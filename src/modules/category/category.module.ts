import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '../jwt/jwt.module';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './category.schema';
import { CategoryService } from './category.service';

@Module({
  imports: [
    JwtAuthModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [],
})
export class CategoryModule {}
