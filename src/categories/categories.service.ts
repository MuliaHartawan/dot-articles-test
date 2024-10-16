import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { categoriesArticle } from '../../src/articles/dto/create-article.dto';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slugify } from '../../src/utils/commons/slug-generate';
import Category from '../../src/models/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories.map((category) => ({
      ...category,
      slug: slugify(category.name),
    }));
  }

  store(category: CreateCategoryDto) {
    return this.categoryRepository.upsert(category, ['name']);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }

  findbyIds(ids: Array<categoriesArticle>) {
    return this.categoryRepository.findBy({ id: In(ids) });
  }
}
