import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  slug?: string;

  @ApiProperty({ example: 'Category Description' })
  @IsOptional()
  @IsString()
  description?: string;
}
