import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  findAllPublic() {
    return this.serviceModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async findBySlug(slug: string) {
    const service = await this.serviceModel.findOne({ slug, isActive: true }).exec();
    if (!service) throw new NotFoundException(`Service '${slug}' not found`);
    return service;
  }

  findAll() {
    return this.serviceModel.find().sort({ order: 1 }).exec();
  }

  create(dto: CreateServiceDto) {
    return this.serviceModel.create(dto);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const updated = await this.serviceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Service ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Service ${id} not found`);
    return { deleted: true };
  }
}
