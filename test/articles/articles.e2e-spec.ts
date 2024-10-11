import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  categoriesArticle,
  CreateArticleDto,
} from '../../src/articles/dto/create-article.dto';
import { UpdateArticleDto } from '../../src/articles/dto/update-article.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  const categoryIdsDummy: categoriesArticle[] = [
    { categoryId: 1 },
    { categoryId: 2 },
  ];

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/articles (GET)', () => {
    return request(app.getHttpServer())
      .get('/articles')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Articles fetched successfully');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/articles/:slug (GET)', () => {
    const slug = 'test-article';
    return request(app.getHttpServer())
      .get(`/articles/${slug}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Article fetched successfully');
        expect(res.body.data).toBeDefined();
      });
  });

  it('/articles (POST)', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'Test Article',
      content: 'This is a test article',
      slug: 'test-article',
      authorId: 1,
      status: 'draft',
      categoryIds: categoryIdsDummy,
    };

    return request(app.getHttpServer())
      .post('/articles')
      .send(createArticleDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Article created successfully');
        expect(res.body.data).toBeDefined();
      });
  });

  it('/articles/:slug (PUT)', () => {
    const slug = 'test-article';
    const updateArticleDto: UpdateArticleDto = {
      title: 'Updated Test Article',
      slug: 'updated-test-article',
    };

    return request(app.getHttpServer())
      .put(`/articles/${slug}`)
      .send(updateArticleDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Article updated successfully');
        expect(res.body.data).toBeDefined();
      });
  });

  it('/articles/:slug (DELETE)', () => {
    const slug = 'test-article';

    return request(app.getHttpServer())
      .delete(`/articles/${slug}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Article deleted successfully');
        expect(res.body.data).toBeDefined();
      });
  });
});
