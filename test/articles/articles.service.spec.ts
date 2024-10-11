import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CategoriesService } from '../../src/categories/categories.service';
import {
  categoriesArticle,
  CreateArticleDto,
} from '../../src/articles/dto/create-article.dto';
import { AuthDTO } from '../../src/utils/auth/auth-decarator';
import { UpdateArticleDto } from '../../src/articles/dto/update-article.dto';
import { ArticlesService } from '../../src/articles/articles.service';
import Article from '../../src/models/article.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;
  // let articleRepository: Repository<Article>;
  // let categoriesService: CategoriesService;
  // let cacheManager: Cache;

  const mockArticleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoriesService = {
    findbyIds: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const categoryIdsData: categoriesArticle[] = [
    { categoryId: 1 },
    { categoryId: 2 },
  ];

  const authDto: AuthDTO = {
    sub: 1,
    name: 'test',
    email: 'test@gmail.com',
    avatar: 'avatar.jpg',
    role: 'admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    module.get<Repository<Article>>(getRepositoryToken(Article));
    module.get<CategoriesService>(CategoriesService);
    module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return cached articles if available', async () => {
      const cachedArticles = [{ id: 1, title: 'Cached Article' }];
      mockCacheManager.get.mockResolvedValue(cachedArticles);

      const result = await service.findAll();

      expect(result).toEqual(cachedArticles);
      expect(mockCacheManager.get).toHaveBeenCalledWith('articles');
      expect(mockArticleRepository.find).not.toHaveBeenCalled();
    });

    it('should fetch articles from repository and cache them if not cached', async () => {
      const articles = [{ id: 1, title: 'New Article' }];
      mockCacheManager.get.mockResolvedValue(null);
      mockArticleRepository.find.mockResolvedValue(articles);

      const result = await service.findAll();

      expect(result).toEqual(articles);
      expect(mockCacheManager.get).toHaveBeenCalledWith('articles');
      expect(mockArticleRepository.find).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'articles',
        articles,
        3600,
      );
    });
  });

  describe('findOne', () => {
    it('should return an article and increment view count if found', async () => {
      const article = { id: 1, title: 'Test Article', viewCount: 0 };
      mockArticleRepository.findOneBy.mockResolvedValue(article);
      mockArticleRepository.update.mockResolvedValue(undefined);

      const result = await service.findOne('test-article');

      expect(result).toEqual(article);
      expect(mockArticleRepository.findOneBy).toHaveBeenCalledWith({
        title: 'test-article',
      });
    });

    it('should return undefined if article is not found', async () => {
      mockArticleRepository.findOneBy.mockResolvedValue(undefined);

      const result = await service.findOne('non-existent-article');

      expect(result).toBeUndefined();
      expect(mockArticleRepository.findOneBy).toHaveBeenCalledWith({
        title: 'non-existent-article',
      });
      expect(mockArticleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('store', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'New Article',
      slug: 'new-article',
      content: 'Content',
      status: 'published',
      categoryIds: categoryIdsData,
    };

    it('should create a new article with categories', async () => {
      const savedArticle = {
        ...createArticleDto,
        id: 1,
        slug: 'new-article',
        authorId: 1,
      };
      const categories = [{ id: 1 }, { id: 2 }];

      mockArticleRepository.findOne.mockResolvedValue(null);
      mockArticleRepository.save.mockResolvedValue(savedArticle);
      mockCategoriesService.findbyIds.mockResolvedValue(categories);

      const result = await service.store(authDto, createArticleDto);

      expect(result).toEqual({ ...savedArticle, categories });
      expect(mockArticleRepository.save).toHaveBeenCalledTimes(2);
      expect(mockCacheManager.del).toHaveBeenCalledWith('articles');
    });

    it('should create a new article with a unique slug if title already exists', async () => {
      const existingArticle = { id: 2, title: 'New Article' };
      mockArticleRepository.findOne.mockResolvedValue(existingArticle);
      mockArticleRepository.save.mockImplementation((article) =>
        Promise.resolve({ ...article, id: 2 }),
      );
      mockCategoriesService.findbyIds.mockResolvedValue([]);

      await service.store(authDto, createArticleDto);

      expect(mockArticleRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Article',
      slug: 'updated-article',
      content: 'Updated Content',
      categoryIds: categoryIdsData,
    };

    it('should update an existing article', async () => {
      const existingArticle = {
        id: 1,
        title: 'Original Article',
        slug: 'original-article',
        content: 'Original Content',
        categories: [{ id: 1 }, { id: 2 }],
      };
      const updatedCategories = [{ id: 3 }, { id: 4 }];

      mockArticleRepository.findOne.mockResolvedValue(existingArticle);
      mockCategoriesService.findbyIds.mockResolvedValue(updatedCategories);
      mockArticleRepository.save.mockResolvedValue({
        ...existingArticle,
        ...updateArticleDto,
        categories: updatedCategories,
      });

      await service.update('original-article', updateArticleDto);

      expect(mockArticleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingArticle,
          ...updateArticleDto,
          categories: updatedCategories,
        }),
      );
      expect(mockCacheManager.del).toHaveBeenCalledWith('articles');
    });

    it('should do nothing if article is not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(undefined);

      await service.update('non-existent-article', updateArticleDto);

      expect(mockArticleRepository.save).not.toHaveBeenCalled();
      expect(mockCacheManager.del).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an article and clear cache', async () => {
      await service.remove('article-to-remove');

      expect(mockArticleRepository.delete).toHaveBeenCalledWith({
        slug: 'article-to-remove',
      });
      expect(mockCacheManager.del).toHaveBeenCalledWith('articles');
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count of an existing article', async () => {
      const article = { id: 1, viewCount: 5 };
      mockArticleRepository.findOne.mockResolvedValue(article);

      await service.incrementViewCount(1);

      expect(mockArticleRepository.update).toHaveBeenCalledWith(1, {
        viewCount: 6,
      });
    });

    it('should do nothing if article is not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(undefined);

      await service.incrementViewCount(999);

      expect(mockArticleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('getArticleBySlug', () => {
    it('should return an article if found', async () => {
      const article = { id: 1, slug: 'test-article' };
      mockArticleRepository.findOne.mockResolvedValue(article);

      const result = await service.getArticleBySlug('test-article');

      expect(result).toEqual(article);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'test-article' },
      });
    });

    it('should return undefined if article is not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getArticleBySlug('non-existent-article');

      expect(result).toBeUndefined();
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'non-existent-article' },
      });
    });
  });
});
