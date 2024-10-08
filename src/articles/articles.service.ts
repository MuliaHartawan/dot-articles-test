import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/models/article.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { slugify } from 'src/utils/commons/slug-generate';
import { AuthDTO } from 'src/utils/auth/auth-decarator';
import { stringRandom } from 'src/utils/commons/string-random';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(slug: string): Promise<Article | undefined> {
    const article = await this.articleRepository.findOneBy({ title: slug });

    console.log('=>', article);

    if (article) {
      await this.incrementViewCount(article.id);
    }

    return article;
  }

  async store(user: AuthDTO, article: CreateArticleDto): Promise<Article> {
    const newArticle = new Article();

    const checkTitle = await this.articleRepository.findOne({
      where: { title: article.title },
    });
    if (checkTitle) {
      newArticle.slug = `${slugify(article.title)}-${stringRandom()}`;
    } else {
      newArticle.slug = slugify(article.title);
    }

    newArticle.title = article.title;
    newArticle.content = article.content;
    newArticle.author_id = user.sub;
    newArticle.status = article.status;

    return await this.articleRepository.save(newArticle);
  }

  async update(slug: string, article: any): Promise<Article> {
    const [checkTitle, number] = await this.articleRepository.findAndCount({
      where: { title: article.title },
    });
    if (article.title && number > 1) {
      article.slug = `${slugify(article.title)}-${stringRandom()}`;
    }

    if (article.title) {
      article.slug = slugify(article.title);
    }

    return await this.articleRepository.save({ slug, ...article });
  }
  async remove(slug: string): Promise<void> {
    await this.articleRepository.delete({ slug: slug });
  }

  async incrementViewCount(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (article) {
      await this.articleRepository.update(id, {
        view_count: article.view_count + 1,
      });
    }
  }
}
