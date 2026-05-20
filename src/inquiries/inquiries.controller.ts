import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || '';
    return this.inquiriesService.create(dto, ip);
  }

  @Get()
  findAll(@Query('type') type?: string) {
    return this.inquiriesService.findAll(type);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.inquiriesService.updateStatus(id, status);
  }
}
