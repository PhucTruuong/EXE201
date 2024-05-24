import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, NotFoundException, ConflictException, HttpException, Query, BadRequestException, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { AppointmentPagination } from './dto/pagination-appointment.dto';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { RequestWithUser } from 'src/interface/request-interface';
import { JwtCustomerGuard } from 'src/auth/guard/jwt-customer.guard';
@ApiTags('Appointments')
@Controller('api/v1/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new appointment in the response',
  })
  @ApiBody({
    type: CreateAppointmentDto
  })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const item = await this.appointmentService.create(createAppointmentDto)
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
  @ApiOperation({ summary: 'List all  appointments' })
  @ApiResponse({
    status: 200,
    description: 'It will list all appointments in the response',
  })
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: AppointmentPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    if (!pagination.page || !pagination.limit) {
      throw new BadRequestException('Page and limit query parameters are required');

    }
    const item = await this.appointmentService.find(pagination)
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
  @ApiOperation({ summary: 'List details  appointments' })
  @ApiResponse({
    status: 200,
    description: 'It will list details appointments in the response',
  })
  async findOne(@Param('id') id: string) {
    const item = await this.appointmentService.findOne(id)
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
  @ApiOperation({ summary: 'update  appointments' })
  @ApiResponse({
    status: 200,
    description: 'It will update appointments in the response',
  })
  @ApiBody({
    type: UpdateAppointmentDto
  })
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    const item = await this.appointmentService.update(id, updateAppointmentDto)

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
  @ApiOperation({ summary: 'delete  appointments' })
  @ApiResponse({
    status: 200,
    description: 'It will delete appointments in the response',
  })
  async remove(@Param('id') id: string) {
    const item = await this.appointmentService.delete(id)

    if (item instanceof InternalServerErrorException
      || item instanceof NotFoundException
      || item instanceof HttpException

    ) {
      return item as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return item;
    }
  }
  @Get('/me/appointments')
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'get appointment by user' })
  @ApiResponse({
    status: 200,
    description: 'It will get all appointment by user in the response',
  })
  async getByUser(@Req() req: RequestWithUser) {
    const item = await this.appointmentService.findByUser(req);
    if (item instanceof InternalServerErrorException || NotFoundException) {
      return item as InternalServerErrorException || NotFoundException
    }
    return item
  }
}
