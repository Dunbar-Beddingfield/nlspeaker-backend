import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

class SettingItemDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class UpsertSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingItemDto)
  settings: SettingItemDto[];
}
