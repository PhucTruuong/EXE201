import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException, ConflictException, HttpException, Query, BadRequestException } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminServiceGuard } from 'src/auth/guard/jwt-admin_customer.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { LocationPagination } from './dto/pagination-location.dto';
@ApiTags('Location')
@Controller('api/v1/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { };

  @Post('')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Location' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new location in the response',
  })
  @ApiBody({
    type: CreateLocationDto
  })
  async create(@Body() createLocationDto: CreateLocationDto) {

    const location = await this.locationService.create(createLocationDto)

    if (location instanceof InternalServerErrorException
      || location instanceof NotFoundException
      || location instanceof ConflictException
      || location instanceof HttpException
    ) {
      return location as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return location;
    };
  };

  @Get('')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lost all  Location' })
  @ApiResponse({
    status: 200,
    description: 'It will list all  location in the response',
  })
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: LocationPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const location = await this.locationService.find(pagination)
    if (location instanceof InternalServerErrorException ||
      location instanceof HttpException ||
      location instanceof BadRequestException
    ) {
      return location as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = location;
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
  @ApiOperation({ summary: 'List detail  Location' })
  @ApiResponse({
    status: 200,
    description: 'It will list detail location in the response',
  })
  async findOne(@Param('id') id: string) {
    const location = await this.locationService.findOne(id)
    if (location instanceof InternalServerErrorException
      || location instanceof NotFoundException
      || location instanceof HttpException
    ) {
      return location as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return location;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update  Location' })
  @ApiResponse({
    status: 200,
    description: 'It will update  location in the response',
  })
  async update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    const location = await this.locationService.update(id, updateLocationDto)

    if (location instanceof InternalServerErrorException
      || location instanceof NotFoundException
      || location instanceof HttpException

    ) {
      return location as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return location;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete  Location' })
  @ApiResponse({
    status: 200,
    description: 'It will delete location in the response',
  })
  async remove(@Param('id') id: string) {
    const location = await this.locationService.delete(id)

    if (location instanceof InternalServerErrorException
      || location instanceof NotFoundException
      || location instanceof HttpException

    ) {
      return location as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return location;
    }
  }
}
