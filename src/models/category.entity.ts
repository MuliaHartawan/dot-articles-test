import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  AfterLoad,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];
}
