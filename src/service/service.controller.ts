import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException, ConflictException, HttpException, Query, BadRequestException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminServiceGuard } from 'src/auth/guard/jwt-admin_customer.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { ServicePagination } from './dto/pagination-service';
@ApiTags('Service')
@Controller('api/v1/service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Service' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new service in the response',
  })
  @ApiBody({
    type: CreateServiceDto
  })
  async create(@Body() createServiceDto: CreateServiceDto) {
    const item = await this.serviceService.create(createServiceDto)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof ConflictException
      || item instanceof HttpException
    ) {
      return item as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return item;
    }
  }

  @Get()
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all  Service' })
  @ApiResponse({
    status: 201,
    description: 'It will list all new service in the response',
  })
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: ServicePagination,
    @StandardParam() standardParam: StandardParams
  ) {
    if (!pagination.page || !pagination.limit) {
      throw new BadRequestException('Page and limit query parameters are required');
    }
    const item = await this.serviceService.find(pagination)
    if (item instanceof InternalServerErrorException ||
      item instanceof HttpException ||
      item instanceof BadRequestException
    ) {
      return item as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = item;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }

  @Get(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List detail  Service' })
  @ApiResponse({
    status: 200,
    description: 'It will list detail service in the response',
  })
  async findOne(@Param('id') id: string) {
    const item = await this.serviceService.findOne(id)
    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException
    ) {
      return item as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return item;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update  Service' })
  @ApiResponse({
    status: 200,
    description: 'It will update  Service in the response',
  })
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const item = await this.serviceService.update(id, updateServiceDto)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAdminServiceGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete  Service' })
  @ApiResponse({
    status: 200,
    description: 'It will delete Service in the response',
  })
 async remove(@Param('id') id: string) {
    const item = await this.serviceService.delete(id)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    }
  }
}