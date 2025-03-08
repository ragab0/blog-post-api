import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'Getting Started with NestJS',
    required: true,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The main content of the blog post',
    example: 'NestJS is a progressive Node.js framework...',
    required: true,
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  @IsOptional()
  content?: string;
}
