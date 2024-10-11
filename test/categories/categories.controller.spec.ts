import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CategoriesService } from '../../src/categories/categories.service';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    store: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('store', () => {
    it('should create a new category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      mockCategoriesService.store.mockResolvedValue({
        id: 1,
        ...createCategoryDto,
      });

      await controller.store(createCategoryDto, mockResponse as any);

      expect(service.store).toHaveBeenCalledWith(createCategoryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: true,
      });
    });

    it('should handle errors when creating a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'New Category' };
      mockCategoriesService.store.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(
        controller.store(createCategoryDto, mockResponse as any),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return all categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      mockCategoriesService.findAll.mockResolvedValue(mockCategories);

      await controller.findAll(mockResponse as any);

      expect(service.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Categories fetched successfully',
        data: mockCategories,
      });
    });

    it('should handle errors when fetching categories', async () => {
      mockCategoriesService.findAll.mockRejectedValue(
        new Error('Fetch failed'),
      );

      await expect(controller.findAll(mockResponse as any)).rejects.toThrow(
        'Fetch failed',
      );
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const id = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      mockCategoriesService.update.mockResolvedValue({ affected: 1 });

      await controller.update(id, updateCategoryDto, mockResponse as any);

      expect(service.update).toHaveBeenCalledWith(id, updateCategoryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: true,
      });
    });

    it('should handle errors when updating a category', async () => {
      const id = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      mockCategoriesService.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        controller.update(id, updateCategoryDto, mockResponse as any),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      const id = 1;
      mockCategoriesService.remove.mockResolvedValue({ affected: 1 });

      await controller.remove(id, mockResponse as any);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Category deleted successfully',
        data: true,
      });
    });

    it('should handle errors when removing a category', async () => {
      const id = 1;
      mockCategoriesService.remove.mockRejectedValue(
        new Error('Removal failed'),
      );

      await expect(controller.remove(id, mockResponse as any)).rejects.toThrow(
        'Removal failed',
      );
    });
  });
});
