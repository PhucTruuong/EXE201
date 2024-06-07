import {
  Controller, Get, Post, Body, UseGuards, InternalServerErrorException,
  ConflictException, NotFoundException, HttpException, Query,
  //BadRequestException
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { CityPagination } from './dto/city-pagination.dto';
@ApiTags('City')
@Controller('api/v1/city')
export class CityController {
  constructor(private readonly cityService: CityService) { '' };

  @Post('')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new city in the response',
  })
  async create(@Body() createCityDto: CreateCityDto) {
    const city = await this.cityService.create(createCityDto)

    if (city instanceof InternalServerErrorException
      || city instanceof NotFoundException
      || city instanceof ConflictException
      || city instanceof HttpException
    ) {
      return city as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return city;
    };
  };

  @Get('')
  @UseGuards(JwtAdminGuard)
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
    @Query() pagination: CityPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const allCity = await this.cityService.find(pagination)
    if (allCity instanceof HttpException) {
      return allCity as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allCity;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    };
  };
};
