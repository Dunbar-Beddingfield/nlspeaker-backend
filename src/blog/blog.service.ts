import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema.js';
import { CreateBlogPostDto } from './dto/create-blog-post.dto.js';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto.js';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private blogModel: Model<BlogPostDocument>,
  ) {}

  findAllPublic() {
    return this.blogModel
      .find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .exec();
  }

  async findBySlug(slug: string) {
    const post = await this.blogModel.findOne({ slug, isPublished: true }).exec();
    if (!post) throw new NotFoundException(`Blog post '${slug}' not found`);
    return post;
  }

  findAll() {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  create(dto: CreateBlogPostDto) {
    const data = {
      ...dto,
      publishedAt: dto.isPublished && !dto.publishedAt ? new Date() : dto.publishedAt,
    };
    return this.blogModel.create(data);
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.blogModel.findById(id).exec();
    if (!existing) throw new NotFoundException(`Blog post ${id} not found`);

    const data: Record<string, unknown> = { ...dto };
    if (dto.isPublished && !existing.publishedAt && !dto.publishedAt) {
      data.publishedAt = new Date();
    }

    const updated = await this.blogModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Blog post ${id} not found`);
    return { deleted: true };
  }
}
