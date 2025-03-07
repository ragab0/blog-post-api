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
// import { UpdatePostDto } from './dto/update-post.dto';
// import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
// import { PaginationDto } from './dto/pagination.dto';
// import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req: any, @Body() CreatePostDto: CreatePostDto) {
    return await this.postsService.create(req.user.id, CreatePostDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = paginationDto.page || 1;
    paginationDto.limit = paginationDto.limit || 10;
    return await this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, req.user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
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
