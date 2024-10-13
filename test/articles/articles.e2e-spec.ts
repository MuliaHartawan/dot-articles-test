import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  categoriesArticle,
  CreateArticleDto,
} from '../../src/articles/dto/create-article.dto';
import { UpdateArticleDto } from '../../src/articles/dto/update-article.dto';
import { CacheModule } from '@nestjs/cache-manager';
import { ArticlesModule } from '../../src/articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { RedisOptions } from '../../config/redis.config';
import { AuthDTO } from '../../src/utils/auth/auth-decarator';
import { AuthGuard } from '../../src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  const categoryIdsDummy: categoriesArticle[] = [
    { categoryId: 1 },
    { categoryId: 2 },
  ];

  const mockAuthUser: AuthDTO = {
    sub: 1,
    name: 'test',
    email: 'test@gmail.com',
    avatar: 'avatar.jpg',
    role: 'admin',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ArticlesModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        CacheModule.register(RedisOptions),
      ],
      providers: [JwtService],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockAuthUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
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

  it('/articles (POST)', async () => {
    const createArticleDto: CreateArticleDto = {
      title: 'Test Article',
      content: 'This is a test article',
      slug: 'test-article',
      authorId: 1,
      status: 'draft',
      categoryIds: categoryIdsDummy,
    };

    const token = await jwtService.signAsync(mockAuthUser, {
      secret: process.env.JWT_SECRET,
    });

    return request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${token}`)
      .send(createArticleDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Article created successfully');
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
      });
  });

  it('/articles/:slug (DELETE)', () => {
    const slug = 'test-article';

    return request(app.getHttpServer())
      .delete(`/articles/${slug}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Article deleted successfully');
      });
  });
});
