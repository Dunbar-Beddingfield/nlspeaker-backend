import { IsString, IsBoolean, IsOptional, IsEnum, MinLength } from 'class-validator';
import type { MediaType } from '../schemas/media-item.schema.js';

export class CreateMediaItemDto {
  @IsEnum(['photo', 'logo', 'press-logo', 'video-clip', 'document'])
  type: MediaType;

  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
