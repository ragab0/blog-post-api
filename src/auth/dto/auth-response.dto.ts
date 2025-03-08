import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'Ragab Eid',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'ragab.dev@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-03-09T01:34:31+02:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2025-03-09T01:34:31+02:00',
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
