import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema.js';
import { CreateTestimonialDto } from './dto/create-testimonial.dto.js';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto.js';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<TestimonialDocument>,
  ) {}

  findAllPublic() {
    return this.testimonialModel
      .find({ isApproved: true })
      .sort({ isFeatured: -1, order: 1 })
      .exec();
  }

  findAll() {
    return this.testimonialModel.find().sort({ createdAt: -1 }).exec();
  }

  create(dto: CreateTestimonialDto) {
    return this.testimonialModel.create(dto);
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const updated = await this.testimonialModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Testimonial ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Testimonial ${id} not found`);
    return { deleted: true };
  }
}
