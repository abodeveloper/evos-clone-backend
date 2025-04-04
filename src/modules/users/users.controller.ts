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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './users.schema';
import { UsersService } from './users.service';
import {
  QueryStringInterface,
  ResponseAllData,
  ResponsePaginationData,
} from '@/common/base.interface';
import { AuthGuard } from '@/guards/auth.guard';
import { RoleGuard } from '@/guards/role.guard';
import { Role } from '@/enums/role.enum';
import { Roles } from '@/guards/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Foydalanuvchi yaratish
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.usersService.createUser(createUserDto);
  }

  // 🔹 Barcha foydalanuvchilarni olish

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(
    @Query()
    query: QueryStringInterface,
  ): Promise<ResponseAllData<UserDocument>> {
    return this.usersService.getAll(query);
  }

  // 🔹 Barcha foydalanuvchilarni olish (query bilan paginatsiya qo‘shish mumkin)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Get()
  async getPaginationData(
    @Query()
    query: QueryStringInterface,
  ): Promise<ResponsePaginationData<UserDocument>> {
    return this.usersService.getPaginationData(query);
  }

  // 🔹 ID bo‘yicha foydalanuvchini olish
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserDocument | null> {
    return this.usersService.getOne(id);
  }

  // 🔹 Foydalanuvchini yangilash
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // 🔹 Foydalanuvchini o‘chirish
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
