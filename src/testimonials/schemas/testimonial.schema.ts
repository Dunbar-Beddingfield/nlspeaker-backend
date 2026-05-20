import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  authorName: string;

  @Prop({ default: '' })
  authorTitle: string;

  @Prop({ default: '' })
  authorOrganization: string;

  @Prop({ default: '' })
  authorPhoto: string;

  @Prop({ required: true })
  text: string;

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ default: '' })
  serviceSlug: string;

  @Prop({ default: '' })
  videoUrl: string;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
