import { IsString, IsBoolean, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  slug: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
