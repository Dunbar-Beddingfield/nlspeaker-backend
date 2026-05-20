import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSettingsController } from './site-settings.controller.js';
import { SiteSettingsService } from './site-settings.service.js';
import { SiteSetting, SiteSettingSchema } from './schemas/site-setting.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SiteSetting.name, schema: SiteSettingSchema }]),
  ],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
