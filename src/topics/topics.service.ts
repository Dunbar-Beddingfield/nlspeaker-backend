import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './schemas/topic.schema.js';
import { CreateTopicDto } from './dto/create-topic.dto.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  findAllPublic() {
    return this.topicModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  findAll() {
    return this.topicModel.find().sort({ order: 1 }).exec();
  }

  create(dto: CreateTopicDto) {
    return this.topicModel.create(dto);
  }

  async update(id: string, dto: UpdateTopicDto) {
    const updated = await this.topicModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Topic ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.topicModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Topic ${id} not found`);
    return { deleted: true };
  }
}
