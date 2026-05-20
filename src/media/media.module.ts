import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { MediaItem, MediaItemSchema } from './schemas/media-item.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: MediaItem.name, schema: MediaItemSchema }])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
