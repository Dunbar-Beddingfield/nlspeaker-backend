import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  findAllPublic(past?: boolean) {
    const filter: Record<string, unknown> = { isPublished: true };
    if (past !== undefined) filter.isPast = past;
    return this.eventModel.find(filter).sort({ date: past ? -1 : 1 }).exec();
  }

  findAll() {
    return this.eventModel.find().sort({ date: -1 }).exec();
  }

  create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  async update(id: string, dto: UpdateEventDto) {
    const updated = await this.eventModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Event ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Event ${id} not found`);
    return { deleted: true };
  }
}
