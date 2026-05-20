import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsController } from './topics.controller.js';
import { TopicsService } from './topics.service.js';
import { Topic, TopicSchema } from './schemas/topic.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
