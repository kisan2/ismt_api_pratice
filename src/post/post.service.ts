import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.repo.create(dto);
    return this.repo.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    return this.repo.save(post);
  }

  async remove(id: string): Promise<{ message: string }> {
    const post = await this.findOne(id);
    await this.repo.softRemove(post); // uses deletedAt instead of actually deleting
    return { message: `Post #${id} deleted successfully` };
  }
}