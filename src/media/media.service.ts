import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItem, MediaItemDocument } from './schemas/media-item.schema.js';
import { CreateMediaItemDto } from './dto/create-media-item.dto.js';
import { UpdateMediaItemDto } from './dto/update-media-item.dto.js';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaItem.name) private mediaModel: Model<MediaItemDocument>,
  ) {}

  findAllPublic(type?: string) {
    const filter: Record<string, unknown> = { isPublic: true };
    if (type) filter.type = type;
    return this.mediaModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  findAll() {
    return this.mediaModel.find().sort({ createdAt: -1 }).exec();
  }

  create(dto: CreateMediaItemDto) {
    return this.mediaModel.create(dto);
  }

  async update(id: string, dto: UpdateMediaItemDto) {
    const updated = await this.mediaModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Media item ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.mediaModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Media item ${id} not found`);
    return { deleted: true };
  }
}
