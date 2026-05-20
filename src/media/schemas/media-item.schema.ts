import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaItemDocument = HydratedDocument<MediaItem>;

export type MediaType = 'photo' | 'logo' | 'press-logo' | 'video-clip' | 'document';

const MEDIA_TYPE_ENUM: MediaType[] = ['photo', 'logo', 'press-logo', 'video-clip', 'document'];

@Schema({ timestamps: true })
export class MediaItem {
  @Prop({ required: true, enum: MEDIA_TYPE_ENUM })
  type: MediaType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  thumbnailUrl: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ default: true })
  isPublic: boolean;
}

export const MediaItemSchema = SchemaFactory.createForClass(MediaItem);
