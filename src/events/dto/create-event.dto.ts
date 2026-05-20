import {
  IsString,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';
import type { EventType } from '../schemas/event.schema.js';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['keynote', 'workshop', 'webinar', 'panel'])
  eventType?: EventType;

  @IsOptional()
  @IsString()
  registrationUrl?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  isPast?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
