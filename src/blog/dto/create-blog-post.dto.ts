import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  slug: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  readingTimeMinutes?: number;
}
