import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpeakerDocument = HydratedDocument<Speaker>;

@Schema({ timestamps: true })
export class Speaker {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  designation: string;

  @Prop({ default: '' })
  shortBio: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ type: [String], default: [] })
  portfolioImages: string[];

  @Prop({ type: [String], default: [] })
  pastClients: string[];

  @Prop({ type: Object, default: {} })
  socialLinks: {
    linkedin?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
  };

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const SpeakerSchema = SchemaFactory.createForClass(Speaker);
