import { Role } from '@/enums/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
