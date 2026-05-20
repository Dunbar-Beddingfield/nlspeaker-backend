import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service.js';
import { UpsertSettingsDto } from './dto/upsert-settings.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Public()
  @Get()
  getAll(@Query('full') full?: string) {
    if (full === 'true') {
      return this.siteSettingsService.getAllFull();
    }
    return this.siteSettingsService.getAll();
  }

  @Patch()
  upsert(@Body() dto: UpsertSettingsDto) {
    return this.siteSettingsService.upsert(dto);
  }
}
