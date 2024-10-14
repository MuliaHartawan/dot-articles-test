import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async store(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const result = await this.categoriesService.store(createCategoryDto);
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Category created successfully',
      data: result ? true : false,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Categories fetched successfully',
      data: categories,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const result = await this.categoriesService.update(id, updateCategoryDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category updated successfully',
      data: result ? true : false,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: number, @Res() res: Response) {
    const result = await this.categoriesService.remove(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Category deleted successfully',
      data: result ? true : false,
    });
  }
}
