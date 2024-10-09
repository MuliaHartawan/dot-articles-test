import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  categoriesArticle,
  CreateArticleDto,
} from 'src/articles/dto/create-article.dto';
import { Category } from 'src/models/category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slugify } from 'src/utils/commons/slug-generate';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoryRepository.find();
    categories.map((category: Category & { slug: string }) => {
      category.slug = slugify(category.name);
    });

    return categories;
  }
  async store(category: CreateCategoryDto) {
    return await this.categoryRepository.upsert(category, ['name']);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }

  async findbyIds(ids: Array<categoriesArticle>) {
    return await this.categoryRepository.findBy({ id: In(ids) });
  }
}
