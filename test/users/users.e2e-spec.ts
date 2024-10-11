import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtToken = 'dot-article-secret';
  });

  it('/users/me (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Get user successfully');
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
      });
  });

  it('/users (PATCH)', () => {
    const updateUserDto: UpdateUserDto = {
      fullName: 'Updated Full Name',
    };

    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Update user successfully');
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
      });
  });
});
