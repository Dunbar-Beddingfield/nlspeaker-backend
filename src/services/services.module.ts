import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller.js';
import { ServicesService } from './services.service.js';
import { Service, ServiceSchema } from './schemas/service.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
