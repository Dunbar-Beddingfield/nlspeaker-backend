import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Speaker, SpeakerDocument } from './schemas/speaker.schema.js';
import { CreateSpeakerDto } from './dto/create-speaker.dto.js';
import { UpdateSpeakerDto } from './dto/update-speaker.dto.js';

@Injectable()
export class SpeakersService {
  constructor(
    @InjectModel(Speaker.name) private speakerModel: Model<SpeakerDocument>,
  ) {}

  findAllPublic() {
    return this.speakerModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async findBySlug(slug: string) {
    const speaker = await this.speakerModel.findOne({ slug, isActive: true }).exec();
    if (!speaker) throw new NotFoundException(`Speaker '${slug}' not found`);
    return speaker;
  }

  findAll() {
    return this.speakerModel.find().sort({ order: 1 }).exec();
  }

  create(dto: CreateSpeakerDto) {
    return this.speakerModel.create(dto);
  }

  async update(id: string, dto: UpdateSpeakerDto) {
    const updated = await this.speakerModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Speaker ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.speakerModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Speaker ${id} not found`);
    return { deleted: true };
  }
}
