import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({ example: 'My first article' })
  @IsOptional()
  @IsString()
  title?: string;

  slug: string;

  @ApiProperty({ example: 'lorem ipsum' })
  @IsOptional()
  @IsString()
  content?: string;

  authorId?: number;

  @ApiProperty({ example: 'draft' })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  viewCount?: number;

  @ApiProperty({ example: [1, 2], type: () => [categoriesArticle] })
  @IsOptional()
  categories?: Array<categoriesArticle>;
}

class categoriesArticle {
  @IsOptional()
  @IsNumber()
  categoryId: number;
}
