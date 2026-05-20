import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(2)
  authorName: string;

  @IsOptional()
  @IsString()
  authorTitle?: string;

  @IsOptional()
  @IsString()
  authorOrganization?: string;

  @IsOptional()
  @IsString()
  authorPhoto?: string;

  @IsString()
  @MinLength(10)
  text: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  serviceSlug?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}
