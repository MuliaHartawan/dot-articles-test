import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { Public } from 'src/utils/auth/auth-validator';
import { AuthDTO, AuthUser } from 'src/utils/auth/auth-decarator';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response) {
    const articles = await this.articlesService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Articles fetched successfully',
      data: articles,
    });
  }

  @Public()
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', type: String })
  async findOne(@Param() slug: string, @Res() res: Response) {
    const article = await this.articlesService.findOne(slug);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Article fetched successfully',
      data: article,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(
    @AuthUser() user: AuthDTO,
    @Body() article: CreateArticleDto,
    @Res() res: Response,
  ) {
    const result = await this.articlesService.store(user, article);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Article created successfully',
      data: result,
    });
  }

  @Put(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', type: String })
  async update(
    @Param() slug: string,
    @Body() article: UpdateArticleDto,
    @Res() res: Response,
  ) {
    const result = await this.articlesService.update(slug, article);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Article updated successfully',
      data: result,
    });
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', type: String })
  async remove(slug: string, @Res() res: Response) {
    const result = await this.articlesService.remove(slug);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Article deleted successfully',
      data: result,
    });
  }
}
