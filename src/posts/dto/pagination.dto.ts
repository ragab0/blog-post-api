import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;
}
