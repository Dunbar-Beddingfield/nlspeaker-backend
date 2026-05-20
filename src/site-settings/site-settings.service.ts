import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSetting, SiteSettingDocument } from './schemas/site-setting.schema.js';
import { UpsertSettingsDto } from './dto/upsert-settings.dto.js';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectModel(SiteSetting.name) private settingModel: Model<SiteSettingDocument>,
  ) {}

  async getAll(): Promise<Record<string, string>> {
    const settings = await this.settingModel.find().exec();
    return settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  }

  async getAllFull() {
    return this.settingModel.find().sort({ key: 1 }).exec();
  }

  async upsert(dto: UpsertSettingsDto) {
    const ops = dto.settings.map((item) =>
      this.settingModel.findOneAndUpdate(
        { key: item.key },
        { $set: { value: item.value } },
        { upsert: true, new: true },
      ).exec(),
    );
    await Promise.all(ops);
    return this.getAll();
  }
}
