import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service.js';
import { CreateTestimonialDto } from './dto/create-testimonial.dto.js';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public()
  @Get()
  findAll() {
    return this.testimonialsService.findAllPublic();
  }

  @Get('admin/all')
  findAllAdmin() {
    return this.testimonialsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
