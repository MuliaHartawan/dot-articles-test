import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Category from '../../src/models/category.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../src/categories/categories.service';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';
import { categoriesArticle } from '@/articles/dto/create-article.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockRepository = {
    find: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories with slugs', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      mockRepository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Category 1', slug: 'category-1' },
        { id: 2, name: 'Category 2', slug: 'category-2' },
      ]);
    });

    it('should handle errors when finding categories', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('store', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      mockRepository.upsert.mockResolvedValue({});

      await service.store(createCategoryDto);

      expect(repository.upsert).toHaveBeenCalledWith(createCategoryDto, [
        'name',
      ]);
    });

    it('should handle errors when creating a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      mockRepository.upsert.mockRejectedValue(new Error('Upsert failed'));

      await expect(service.store(createCategoryDto)).rejects.toThrow(
        'Upsert failed',
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      mockRepository.update.mockResolvedValue({});

      await service.update(id, updateCategoryDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateCategoryDto);
    });

    it('should handle errors when updating a category', async () => {
      const id = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(id, updateCategoryDto)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = 1;
      mockRepository.delete.mockResolvedValue({});

      await service.remove(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should handle errors when removing a category', async () => {
      const id = 1;
      mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove(id)).rejects.toThrow('Delete failed');
    });
  });

  describe('findbyIds', () => {
    it('should find categories by ids', async () => {
      const mockIds: categoriesArticle[] = [
        { categoryId: 1 },
        { categoryId: 2 },
        { categoryId: 3 },
      ];
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
      ];
      mockRepository.findBy.mockResolvedValue(mockCategories);

      const result = await service.findbyIds(mockIds);

      expect(repository.findBy).toHaveBeenCalledWith({ id: expect.anything() });
      expect(result).toEqual(mockCategories);
    });

    it('should handle errors when finding categories by ids', async () => {
      const mockIds: categoriesArticle[] = [
        { categoryId: 1 },
        { categoryId: 2 },
        { categoryId: 3 },
      ];
      mockRepository.findBy.mockRejectedValue(new Error('Find failed'));

      await expect(service.findbyIds(mockIds)).rejects.toThrow('Find failed');
    });
  });
});
