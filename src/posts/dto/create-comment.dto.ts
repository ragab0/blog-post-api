import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment - NOT YET !!!',
    example: 'Great post! Very informative.',
    required: true,
    minLength: 1,
  })
  @IsString()
  content: string;
}
