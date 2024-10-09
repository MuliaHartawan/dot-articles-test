import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Article from './article.entity';

@Entity('categories')
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
