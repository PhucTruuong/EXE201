import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, InternalServerErrorException, HttpException, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { CategoryPagination } from './dto/category-pagination.dto';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
@ApiTags('Category')
@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }
   
  @UseGuards(JwtAdminGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(createCategoryDto)

    if (category instanceof InternalServerErrorException

      || category instanceof NotFoundException
      || category instanceof ConflictException
      || category instanceof HttpException
    ) {
      return category as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return category;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Get()
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: CategoryPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    if (!pagination.page || !pagination.limit) {
      throw new BadRequestException('Page and limit query parameters are required');
    }
    const allCategory = await this.categoryService.findAllCategory(pagination)
    if (allCategory instanceof InternalServerErrorException ||
      allCategory instanceof HttpException
    ) {
      return allCategory as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allCategory;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOneCategory(id)
    if (category instanceof InternalServerErrorException
      || category instanceof NotFoundException
      || category instanceof HttpException
    ) {
      return category as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return category;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.updateCategory(id, updateCategoryDto);

    if (category instanceof InternalServerErrorException
      || category instanceof NotFoundException
      || category instanceof HttpException

    ) {
      return category as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return category;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const category = await this.categoryService.deleteCategory(id)

    if (category instanceof InternalServerErrorException
      || category instanceof NotFoundException
      || category instanceof HttpException

    ) {
      return category as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return category;
    }
  }
}
