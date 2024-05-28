import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ConflictException, HttpException, NotFoundException, InternalServerErrorException, Req, Query, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtCustomerGuard } from 'src/auth/guard/jwt-customer.guard';
import { RequestWithUser } from 'src/interface/request-interface';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { BookingPagination } from './dto/pagination-booking.dto';
@ApiTags('Bookings')
@Controller('api/v1/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new booking in the response',
  })
  @ApiBody({
    type: CreateBookingDto
  })
  async create(@Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser) {
    const item = await this.bookingService.create(createBookingDto, req)
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
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] List all  bookings' })
  @ApiResponse({
    status: 200,
    description: '[ADMIN]It will list all bookings in the response'
  })
  @StandardResponse({
    isPaginated: true,

  })
  async findAll(
    @Query() pagination: BookingPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const item = await this.bookingService.find(pagination);

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List details  bookings' })
  @ApiResponse({
    status: 200,
    description: 'It will list details bookings in the response',
  })
  async findOne(@Param('id') id: string) {
    const item = await this.bookingService.findOne(id)
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
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'update  bookings' })
  @ApiResponse({
    status: 200,
    description: 'It will update bookings in the response',
  })
  @ApiBody({
    type: UpdateBookingDto
  })
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const item = await this.bookingService.update(id, updateBookingDto)

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
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'delete bookings' })
  @ApiResponse({
    status: 200,
    description: 'It will deletebookings in the response',
  })
  async remove(@Param('id') id: string) {
    const item = await this.bookingService.delete(id)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    };
  };

  @Get('/me/bookings')
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get bookings by user' })
  @ApiResponse({
    status: 200,
    description: 'It will get all bookings by user in the response',
  })
  @StandardResponse({
    isPaginated: true,
    isFiltered: true,
  })
  async getByUser(
    @Query() pagination: BookingPagination,
    @StandardParam() standardParam: StandardParams,
    @Req() req: RequestWithUser) {
    if (!pagination.page || !pagination.limit) {
      throw new BadRequestException('Page and limit query parameters are required');

    }
    const item = await this.bookingService.findByUser(req, pagination)
    if (item instanceof InternalServerErrorException ||
      item instanceof HttpException ||
      item instanceof BadRequestException
    ) {
      return item as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = item;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    };
  };
}
