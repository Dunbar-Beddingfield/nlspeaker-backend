import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  shortDescription: string;

  @Prop({ default: '' })
  fullDescription: string;

  @Prop({ type: [String], default: [] })
  outcomes: string[];

  @Prop({ default: '' })
  idealAudience: string;

  @Prop({ default: '' })
  duration: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
