import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [
    JwtAuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // AuthModule uchun export qilamiz
})
export class UsersModule {}
