import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Article } from './article.entity';
import { Category } from './category.entity';

@Entity('article_categories')
export class ArticleCategory {
  @PrimaryColumn()
  article_id: number;

  @PrimaryColumn()
  category_id: number;

  @ManyToOne(() => Article, (article) => article.categories, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
