import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great post! Very informative.',
  })
  content: string;

  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2025-03-09T01:34:31+02:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment last update date',
    example: '2025-03-09T01:34:31+02:00',
  })
  updatedAt: Date;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Post ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'NestJS is a progressive Node.js framework...',
  })
  content: string;

  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;

  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  @ApiProperty({
    description: 'Post creation date',
    example: '2025-03-09T01:34:31+02:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post last update date',
    example: '2025-03-09T01:34:31+02:00',
  })
  updatedAt: Date;
}
