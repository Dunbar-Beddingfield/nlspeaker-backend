import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InquiryDocument = HydratedDocument<Inquiry>;

export type InquiryType = 'booking' | 'contact';
export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived';

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ enum: ['booking', 'contact'], default: 'contact' })
  type: InquiryType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  organization: string;

  @Prop()
  eventDate: Date;

  @Prop({ default: '' })
  eventType: string;

  @Prop({ default: '' })
  eventLocation: string;

  @Prop({ default: '' })
  audienceSize: string;

  @Prop({ default: '' })
  budget: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['new', 'read', 'replied', 'archived'], default: 'new' })
  status: InquiryStatus;

  @Prop({ default: '' })
  ipAddress: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
