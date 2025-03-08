/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PostResponseDto } from './dto/post-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async create(@Request() req: any, @Body() CreatePostDto: CreatePostDto) {
    return await this.postsService.create(req.user.id, CreatePostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated posts',
    type: [PostResponseDto],
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = paginationDto.page || 1;
    paginationDto.limit = paginationDto.limit || 10;
    return await this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the post',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, req.user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Post deleted successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.postsService.remove(id, req.user.id);
    return { message: 'Post deleted successfully' };
  }

  // @Post(':id/comments')
  // @UseGuards(AuthGuard)
  // async addComment(
  //   @Param('id') id: string,
  //   @Request() req: any,
  //   @Body() createCommentDto: CreateCommentDto,
  // ) {
  //   return await this.postsService.addComment(
  //     id,
  //     req.user.id,
  //     createCommentDto,
  //   );
  // }
}
