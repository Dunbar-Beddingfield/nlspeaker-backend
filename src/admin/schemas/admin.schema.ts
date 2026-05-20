import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

export type AdminRole = 'super-admin' | 'editor';

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['super-admin', 'editor'], default: 'editor' })
  role: AdminRole;

  @Prop()
  lastLoginAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
