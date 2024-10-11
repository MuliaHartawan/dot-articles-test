import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/categories (POST)', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Test Category',
      description: 'This is a test category',
    };

    return request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Category created successfully');
        expect(res.body.statusCode).toBe(201);
        expect(res.body.data).toBe(true);
      });
  });

  it('/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Categories fetched successfully');
        expect(res.body.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/categories/:id (PATCH)', () => {
    const categoryId = 1;
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Test Category',
    };

    return request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send(updateCategoryDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Category updated successfully');
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toBe(true);
      });
  });

  it('/categories/:id (DELETE)', () => {
    const categoryId = 1;

    return request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Category deleted successfully');
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toBe(true);
      });
  });
});
