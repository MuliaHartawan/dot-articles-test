import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/models/article.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { slugify } from 'src/utils/commons/slug-generate';
import { AuthDTO } from 'src/utils/auth/auth-decarator';
import { stringRandom } from 'src/utils/commons/string-random';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Category } from 'src/models/category.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private categoryService: CategoriesService,
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(slug: string): Promise<Article | undefined> {
    const article = await this.articleRepository.findOneBy({ title: slug });
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

    const savedArticle = await this.articleRepository.save(newArticle);
    if (article.categoryIds && article.categoryIds.length > 0) {
      const categories = await this.categoryService.findbyIds(
        article.categoryIds,
      );

      savedArticle.categories = categories;

      await this.articleRepository.save(savedArticle);
    }

    return savedArticle;
  }

  async update(slug: string, article: UpdateArticleDto): Promise<void> {
    const [existingArticle, number] = await this.articleRepository.findAndCount(
      {
        where: { title: slug },
        relations: ['categories'],
      },
    );
    if (article.title && number > 1) {
      article.slug = `${slugify(article.title)}-${stringRandom()}`;
    }

    if (article.title) {
      article.slug = slugify(article.title);
    }

    const updatedArticle = {
      ...article,
    } as UpdateArticleDto & { categories: Category[] };

    if (article.categoryIds && article.categoryIds.length > 0) {
      const categories = await this.categoryService.findbyIds(
        article.categoryIds,
      );

      updatedArticle.categories = categories;
    }
    Object.assign(existingArticle, updatedArticle);

    await this.articleRepository.save(existingArticle);
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

  async getArtcleBySlug(slug: string): Promise<Article | undefined> {
    return await this.articleRepository.findOne({ where: { slug: slug } });
  }
}
