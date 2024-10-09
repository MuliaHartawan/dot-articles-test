import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class SlugValidationPipe implements PipeTransform {
  constructor(private readonly articleService: ArticlesService) {}

  async transform(value: string) {
    const article = await this.articleService.getArticleBySlug(value);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }
}
