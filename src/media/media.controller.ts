import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MediaService } from './media.service.js';
import { CreateMediaItemDto } from './dto/create-media-item.dto.js';
import { UpdateMediaItemDto } from './dto/update-media-item.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get()
  findAll(@Query('type') type?: string) {
    return this.mediaService.findAllPublic(type);
  }

  @Get('admin/all')
  findAllAdmin() {
    return this.mediaService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMediaItemDto) {
    return this.mediaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMediaItemDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
