import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, InternalServerErrorException, HttpException, Query, BadRequestException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { CategoryPagination } from './dto/category-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAdminServiceGuard } from 'src/auth/guard/jwt-admin_customer.guard';
@ApiTags('Category')
@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }
 
  @Post()
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Successfully created pet.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: CreateCategoryDto
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createCategoryDto: CreateCategoryDto,
  @UploadedFile() image: Express.Multer.File,

) {
    const category = await this.categoryService.createCategory({...createCategoryDto,image})

    if (category instanceof InternalServerErrorException

      || category instanceof NotFoundException
      || category instanceof ConflictException
      || category instanceof HttpException
    ) {
      return category as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return category;
    }
  };

  @Get()
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'list aLL  category' })
  @ApiResponse({
    status: 201,
    description: 'It will list all category in the response',
  })
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: CategoryPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    // if (!pagination.page || !pagination.limit) {
    //   throw new BadRequestException('Page and limit query parameters are required');
    // }
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
  };

  @Get(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'list one detail  category' })
  @ApiResponse({
    status: 201,
    description: 'It will list detail category in the response',
  })
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
  };

  @Patch(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'update  category' })
  @ApiResponse({
    status: 200,
    description: 'It will update category in the response',
  })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.updateCategory(id, updateCategoryDto);

    if (category instanceof InternalServerErrorException
      || category instanceof NotFoundException
      || category instanceof HttpException

    ) {
      return category as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return category;
    };
  };


  @Delete(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete  category' })
  @ApiResponse({
    status: 201,
    description: 'It will delete category in the response',
  })
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
  };
}
