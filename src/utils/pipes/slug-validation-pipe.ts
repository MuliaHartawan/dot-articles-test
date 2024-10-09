import {
  PipeTransform,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class SlugValidationPipe implements PipeTransform {
  constructor(private articleService: ArticlesService) {}

  async transform(value: any) {
    const article = await this.articleService.getArtcleBySlug(value);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }
}
