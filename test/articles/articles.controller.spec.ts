import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuthDTO } from '../../src/utils/auth/auth-decarator';
import { ArticlesController } from '../../src/articles/articles.controller';
import { ArticlesService } from '../../src/articles/articles.service';
import {
  categoriesArticle,
  CreateArticleDto,
} from '../../src/articles/dto/create-article.dto';
import { UpdateArticleDto } from '../../src/articles/dto/update-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  // let service: ArticlesService;

  const mockArticlesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    store: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const categoryIdsData: categoriesArticle[] = [
    { categoryId: 3 },
    { categoryId: 4 },
  ];

  const user: AuthDTO = {
    sub: 1,
    name: 'test',
    email: 'test@gmail.com',
    avatar: 'avatar.jpg',
    role: 'admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const articles = [{ id: 1, title: 'Test Article' }];
      mockArticlesService.findAll.mockResolvedValue(articles);
      const res = mockResponse();

      await controller.findAll(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Articles fetched successfully',
        data: articles,
      });
    });

    it('should handle errors', async () => {
      mockArticlesService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      const res = mockResponse();

      await expect(controller.findAll(res)).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const article = { id: 1, title: 'Test Article', slug: 'test-article' };
      mockArticlesService.findOne.mockResolvedValue(article);
      const res = mockResponse();

      await controller.findOne('test-article', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Article fetched successfully',
        data: article,
      });
    });

    it('should handle not found article', async () => {
      mockArticlesService.findOne.mockResolvedValue(null);
      const res = mockResponse();

      await controller.findOne('non-existent-article', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Article fetched successfully',
        data: null,
      });
    });
  });

  describe('store', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
        slug: 'new-article',
        content: 'Content',
        status: 'published',
        categoryIds: categoryIdsData,
      };
      const createdArticle = { id: 1, ...createArticleDto };
      mockArticlesService.store.mockResolvedValue(createdArticle);
      const res = mockResponse();

      await controller.store(user, createArticleDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CREATED,
        message: 'Article created successfully',
        data: createdArticle,
      });
    });

    it('should handle errors during article creation', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
        slug: 'new-article',
        content: 'Content',
        status: 'published',
        categoryIds: categoryIdsData,
      };
      mockArticlesService.store.mockRejectedValue(new Error('Creation failed'));
      const res = mockResponse();

      await expect(
        controller.store(user, createArticleDto, res),
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('update', () => {
    it('should update an existing article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Article',
        slug: 'updated-article',
        content: 'Updated Content',
      };
      const updatedArticle = { id: 1, ...updateArticleDto };
      mockArticlesService.update.mockResolvedValue(updatedArticle);
      const res = mockResponse();

      await controller.update('existing-article', updateArticleDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Article updated successfully',
        data: updatedArticle,
      });
    });

    it('should handle errors during article update', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Article',
        slug: 'updated-article',
        content: 'Updated Content',
      };
      mockArticlesService.update.mockRejectedValue(new Error('Update failed'));
      const res = mockResponse();

      await expect(
        controller.update('existing-article', updateArticleDto, res),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      mockArticlesService.remove.mockResolvedValue(undefined);
      const res = mockResponse();

      await controller.remove('article-to-delete', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Article deleted successfully',
        data: undefined,
      });
    });

    it('should handle errors during article removal', async () => {
      mockArticlesService.remove.mockRejectedValue(
        new Error('Deletion failed'),
      );
      const res = mockResponse();

      await expect(controller.remove('article-to-delete', res)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });
});
