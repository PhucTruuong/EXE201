import {
  Controller, Get, Post, Body,
  Patch, Param, Delete, UseGuards,
  NotFoundException, ConflictException,
  InternalServerErrorException,
  HttpException, Query,
  //BadRequestException,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { BrandPagination } from './dto/pagination-brand.dto';
import { JwtAdminServiceGuard } from 'src/auth/guard/jwt-admin_customer.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { LoggerService } from 'src/my-logger/service/logger.service';
@ApiTags('Brand')
@Controller('api/v1/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { };
  private readonly logger = new LoggerService(BrandController.name);

  @Post('/')
  @UseGuards(JwtAdminServiceGuard)
  @Throttle({ short: { limit: 3, ttl: 2000 } })
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Successfully created pet.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: CreateBrandDto
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createBrandDto: CreateBrandDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const brand = await this.brandService.createBrand({ ...createBrandDto, image });

    if (brand instanceof InternalServerErrorException
      || brand instanceof NotFoundException
      || brand instanceof ConflictException
      || brand instanceof HttpException
    ) {
      return brand as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return brand;
    };
  };

  //@UseGuards(JwtAdminServiceGuard)
  @Get('/')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
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
    this.logger.log(`Request all brand`, BrandController.name);
    const allBrand = await this.brandService.findAllBrand(pagination);

    if (allBrand instanceof HttpException
    ) {
      return allBrand as HttpException;
    } else {
      const { data, totalCount } = allBrand;
      standardParam.setPaginationInfo({
        count: totalCount,
        limit: data.length
      });
      return data;
    };
  };

  @Get(':id')
  @UseGuards(JwtAdminServiceGuard)
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
    };
  };

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
    };
  };

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
    };
  };
};
