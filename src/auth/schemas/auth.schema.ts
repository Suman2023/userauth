import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<AuthUser>;
@Schema({ timestamps: true })
export class AuthUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthUser);
