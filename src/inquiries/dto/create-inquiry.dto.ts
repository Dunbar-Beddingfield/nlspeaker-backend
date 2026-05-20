import {
  IsString,
  IsEmail,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
} from 'class-validator';
import type { InquiryType } from '../schemas/inquiry.schema.js';

export class CreateInquiryDto {
  @IsOptional()
  @IsEnum(['booking', 'contact'])
  type?: InquiryType;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsString()
  eventLocation?: string;

  @IsOptional()
  @IsString()
  audienceSize?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @IsString()
  @MinLength(10)
  message: string;

  @IsOptional()
  @IsBoolean()
  consentGiven?: boolean;
}
