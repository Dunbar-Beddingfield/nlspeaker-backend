import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsObject,
  MinLength,
} from 'class-validator';

export class CreateSpeakerDto {
  @IsString()
  slug: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  shortBio?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioImages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pastClients?: string[];

  @IsOptional()
  @IsObject()
  socialLinks?: {
    linkedin?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
  };

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
