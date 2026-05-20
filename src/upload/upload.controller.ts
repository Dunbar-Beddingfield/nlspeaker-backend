import { Body, Controller, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { UploadService } from './upload.service.js';

class UploadImageDto {
  @IsString()
  base64: string;

  @IsString()
  folder: string;
}

class UploadDocumentDto {
  @IsString()
  base64: string;

  @IsString()
  folder: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  async uploadImage(@Body() dto: UploadImageDto) {
    const url = await this.uploadService.uploadBase64(dto.base64, dto.folder);
    return { url };
  }

  @Post('document')
  async uploadDocument(@Body() dto: UploadDocumentDto) {
    const url = await this.uploadService.uploadBase64(dto.base64, dto.folder);
    return { url };
  }
}
