import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export type EventType = 'keynote' | 'workshop' | 'webinar' | 'panel';

const EVENT_TYPE_ENUM: EventType[] = ['keynote', 'workshop', 'webinar', 'panel'];

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  venue: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ enum: EVENT_TYPE_ENUM, default: 'keynote' })
  eventType: EventType;

  @Prop({ default: '' })
  registrationUrl: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: false })
  isPast: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isPublished: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
