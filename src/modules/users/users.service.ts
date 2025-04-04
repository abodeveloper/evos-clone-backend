import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BaseService } from '@/common/base-service';
import {
  QueryStringInterface,
  ResponseAllData,
  ResponsePaginationData,
} from '@/common/base.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';
import { Role } from '@/enums/role.enum';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return super.findOneByCondition({ username });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return super.findOneByCondition({ email });
  }

  async existByUsername(username: string): Promise<boolean> {
    return super.exists({ username });
  }

  async existByEmail(email: string): Promise<boolean> {
    return super.exists({ email });
  }

  async getPaginationData(
    queryString: QueryStringInterface,
  ): Promise<ResponsePaginationData<UserDocument>> {
    const searchFields = ['username', 'email'];
    const selectFields = 'username, email';
    return super.findAllWithPagination(queryString, searchFields, selectFields);
  }

  async getAll(
    queryString: QueryStringInterface,
  ): Promise<ResponseAllData<UserDocument>> {
    const searchFields = ['username', 'email'];
    const selectFields = 'username, email';
    return super.findAll(queryString, searchFields, selectFields);
  }

  async getOne(id: string): Promise<UserDocument> {
    return super.findOne(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, email, password } = createUserDto;

    const usernameExists = await this.existByUsername(username);
    if (usernameExists) {
      throw new ConflictException('Bu username allaqachon mavjud');
    }

    const emailExists = await this.existByEmail(email);
    if (emailExists) {
      throw new ConflictException('Bu email allaqachon mavjud');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return super.create({ username, email, password: hashedPassword });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return super.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<UserDocument> {
    return super.remove(id);
  }

  async createAdminUser() {
    const existingUser = await this.userModel.findOne({
      username: 'admin',
    });
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin_password', 10);
    const adminUser = new this.userModel({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  }
}
