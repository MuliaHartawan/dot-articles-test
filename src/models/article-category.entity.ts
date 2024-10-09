import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import Article from './article.entity';
import Category from './category.entity';

@Entity('article_categories', { synchronize: false })
export default class ArticleCategory {
  @PrimaryColumn()
  articleId: number;

  @PrimaryColumn()
  categoryId: number;

  @ManyToOne(() => Article, (article) => article.categories, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
