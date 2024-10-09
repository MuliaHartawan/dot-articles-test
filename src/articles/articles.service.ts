import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Article from 'src/models/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { slugify } from 'src/utils/commons/slug-generate';
import { stringRandom } from 'src/utils/commons/string-random';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthDTO } from 'src/utils/auth/auth-decarator';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly categoryService: CategoriesService,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleRepository.find(); // Menghapus redundant await
  }

  async findOne(slug: string): Promise<Article | undefined> {
    const article = await this.articleRepository.findOneBy({ title: slug });
    if (article) {
      await this.incrementViewCount(article.id);
    }
    return article;
  }

  async store(user: AuthDTO, articleData: CreateArticleDto): Promise<Article> {
    const newArticle = new Article();

    const checkTitle = await this.articleRepository.findOne({
      where: { title: articleData.title },
    });
    newArticle.slug = checkTitle
      ? `${slugify(articleData.title)}-${stringRandom()}`
      : slugify(articleData.title);

    newArticle.title = articleData.title;
    newArticle.content = articleData.content;
    newArticle.authorId = user.sub; // Ganti author_id menjadi authorId
    newArticle.status = articleData.status;

    const savedArticle = await this.articleRepository.save(newArticle);
    if (articleData.categoryIds && articleData.categoryIds.length > 0) {
      const categories = await this.categoryService.findbyIds(
        articleData.categoryIds,
      );
      savedArticle.categories = categories;

      await this.articleRepository.save(savedArticle);
    }

    return savedArticle;
  }

  async update(slug: string, articleData: UpdateArticleDto): Promise<void> {
    const existingArticle = await this.articleRepository.findOne({
      where: { title: slug },
      relations: ['categories'],
    });
    if (!existingArticle) return;

    if (articleData.title) {
      articleData.slug = `${slugify(articleData.title)}-${stringRandom()}`;
    }

    const updatedArticle = {
      ...articleData,
      categories: articleData.categoryIds
        ? await this.categoryService.findbyIds(articleData.categoryIds)
        : [],
    };

    Object.assign(existingArticle, updatedArticle);
    await this.articleRepository.save(existingArticle);
  }

  async remove(slug: string): Promise<void> {
    await this.articleRepository.delete({ slug });
  }

  async incrementViewCount(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (article) {
      await this.articleRepository.update(id, {
        viewCount: article.viewCount + 1, // Ganti view_count menjadi viewCount
      });
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return this.articleRepository.findOne({ where: { slug } });
  }
}
