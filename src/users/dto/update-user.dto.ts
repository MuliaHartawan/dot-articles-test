import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'password123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name?: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar_url?: string;

  @ApiProperty({ example: 'admin' })
  @IsOptional()
  @IsEnum(['admin', 'author', 'user'])
  role?: 'admin' | 'author' | 'user' = 'user';
}
