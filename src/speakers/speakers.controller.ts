import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SpeakersService } from './speakers.service.js';
import { CreateSpeakerDto } from './dto/create-speaker.dto.js';
import { UpdateSpeakerDto } from './dto/update-speaker.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('speakers')
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  @Public()
  @Get()
  findAll() {
    return this.speakersService.findAllPublic();
  }

  // Declared before :slug to avoid param collision
  @Get('admin/all')
  findAllAdmin() {
    return this.speakersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSpeakerDto) {
    return this.speakersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSpeakerDto) {
    return this.speakersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.speakersService.remove(id);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.speakersService.findBySlug(slug);
  }
}
