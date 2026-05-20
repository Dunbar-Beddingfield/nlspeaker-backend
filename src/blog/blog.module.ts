import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller.js';
import { BlogService } from './blog.service.js';
import { BlogPost, BlogPostSchema } from './schemas/blog-post.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
