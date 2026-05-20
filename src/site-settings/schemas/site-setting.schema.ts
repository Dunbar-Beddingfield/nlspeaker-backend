import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteSettingDocument = HydratedDocument<SiteSetting>;

export type SettingType = 'text' | 'textarea' | 'url' | 'image';

@Schema({ timestamps: true })
export class SiteSetting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: '' })
  value: string;

  @Prop({ required: true })
  label: string;

  @Prop({ enum: ['text', 'textarea', 'url', 'image'], default: 'text' })
  type: SettingType;
}

export const SiteSettingSchema = SchemaFactory.createForClass(SiteSetting);
