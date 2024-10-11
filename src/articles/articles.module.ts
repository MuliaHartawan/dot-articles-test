import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from '../../src/categories/categories.service';
import Article from '../../src/models/article.entity';
import Category from '../../src/models/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category])],
  providers: [ArticlesService, CategoriesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
