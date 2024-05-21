import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, ConflictException, InternalServerErrorException, HttpException, Query, BadRequestException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { BrandPagination } from './dto/pagination-brand.dto';

@ApiTags('Brand')
@Controller('api/v1/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new brand in the response',
  })
  @ApiBody({
    type: CreateBrandDto
  })
  async create(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandService.createBrand(createBrandDto)

    if (brand instanceof InternalServerErrorException
      || brand instanceof NotFoundException
      || brand instanceof ConflictException
      || brand instanceof HttpException
    ) {
      return brand as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return brand;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @StandardResponse({
    isPaginated: true,
  })
  @ApiOperation({ summary: 'Get all  brand with pagination' })
  @ApiResponse({
    status: 200,
    description: 'It will list all  new brand in the response',
  })
  async findAll(
    @Query() pagination: BrandPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    if (!pagination.page || !pagination.limit) {
      throw new BadRequestException('Page and limit query parameters are required');
    }
    const allBrand = await this.brandService.findAllBrand(pagination)
    if (allBrand instanceof InternalServerErrorException ||
      allBrand instanceof HttpException ||
      allBrand instanceof BadRequestException
    ) {
      return allBrand as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allBrand;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }
  @Get(':id')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'FInd one  brand' })
  @ApiResponse({
    status: 200,
    description: 'It will  get a  brand detail  in the response',
  })
  async findOne(@Param('id') id: string) {
    const brand = await this.brandService.findOneBrand(id)
    if (brand instanceof InternalServerErrorException
      || brand instanceof NotFoundException
      || brand instanceof HttpException
    ) {
      return brand as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return brand;
    }
  }
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update one  brand' })
  @ApiResponse({
    status: 200,
    description: 'It will update a  brand  in the response',
  })
  @ApiBody({
    type: UpdateBrandDto
  })
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandService.updateBrand(id, updateBrandDto)

    if (brand instanceof InternalServerErrorException
      || brand instanceof NotFoundException
      || brand instanceof HttpException

    ) {
      return brand as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return brand;
    }
  }
  @UseGuards(JwtAdminGuard)
  @ApiOperation({ summary: 'Delete one  brand' })
  @ApiResponse({
    status: 200,
    description: 'It will delete a  brand  in db',
  })
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string) {
    const brand = await this.brandService.deleteBrand(id)

    if (brand instanceof InternalServerErrorException
      || brand instanceof NotFoundException
      || brand instanceof HttpException

    ) {
      return brand as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return brand;
    }
  }
}
