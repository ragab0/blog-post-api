import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
// import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postRepo.create({
      ...createPostDto,
      // author: { id: userId }, // creating a reference to the User entity
      author: user, // FIXME: a temporary solution;
    });
    console.log('Created post is:', post);

    return await this.postRepo.save(post);
  }

  async findAll(paginationDto: PaginationDto) {
    // const [posts, total] = await this.postRepo.findAndCount({
    //   skip: (paginationDto.page - 1) * paginationDto.limit,
    //   take: paginationDto.limit,
    //   order: { createdAt: 'DESC' },
    //   relations: ['author'],
    //   select: {
    //     content: () => 'SUBSTRING(content, 1, 20)', // Select first 20 chars of content
    //     author: {
    //       id: true,
    //       name: true,
    //       avatar: true,
    //     },
    //   },
    // });

    // const queryBuilder = this.postRepo
    //   .createQueryBuilder('post')
    //   .leftJoinAndSelect('post.author', 'author') // Join the author relation
    //   .select([
    //     'post.id', // Include the post ID
    //     'SUBSTRING(post.content, 1, 20) AS content', // Truncate content to 20 chars ON THE QUERY execution...
    //     'post.createdAt',
    //     'author.id',
    //     'author.name',
    //     'author.avatar',
    //   ])
    //   .orderBy('post.createdAt', 'DESC')
    //   .skip((paginationDto.page - 1) * paginationDto.limit)
    //   .take(paginationDto.limit);
    // const [posts, total] = await queryBuilder.getManyAndCount();

    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .select([
        'post.id AS id',
        'SUBSTRING(post.content, 1, 20) AS content', // Truncate content
        'post.createdAt AS createdAt',
        'author.id AS authorId',
        'author.name AS authorName',
        'author.avatar AS authorAvatar',
      ])
      .orderBy('post.createdAt', 'DESC')
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit);

    const posts = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return {
      items: posts,
      meta: {
        total,
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
      select: {
        author: {
          id: true,
          name: true,
          avatar: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id, author: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException('Post not found or unauthorized');
    }

    Object.assign(post, updatePostDto);
    return await this.postRepo.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.postRepo.findOne({
      where: { id, author: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException('Post not found or unauthorized');
    }

    // If the post exists and belongs to the user, delete it
    await this.postRepo.delete(id);
  }

  // async addComment(
  //   postId: string,
  //   userId: string,
  //   createCommentDto: CreateCommentDto,
  // ): Promise<Comment> {
  //   const post = await this.postRepo.findOne({
  //     where: { id: postId },
  //   });

  //   if (!post) {
  //     throw new NotFoundException('Post not found');
  //   }

  //   const comment = this.commentRepo.create({
  //     ...createCommentDto,
  //     post: { id: postId },
  //     author: { id: userId },
  //   });

  //   return await this.commentRepo.save(comment);
  // }
}
