import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  slug: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  outcomes?: string[];

  @IsOptional()
  @IsString()
  idealAudience?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
