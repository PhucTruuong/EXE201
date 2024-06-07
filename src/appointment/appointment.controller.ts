import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  HttpException,
  Query,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import {
  StandardParam,
  StandardParams,
  StandardResponse,
} from 'nest-standard-response';
import { AppointmentPagination } from './dto/pagination-appointment.dto';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { RequestWithUser } from 'src/interface/request-interface';
import { JwtCustomerGuard } from 'src/auth/guard/jwt-customer.guard';
import { sendSuccessResponse } from 'src/constants/sendSucessResponse';
import HttpStatusCodes from 'src/constants/HttpStatusCodes';
import { Response } from 'express';
@ApiTags('Appointments')
@Controller('api/v1/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {};

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new appointment in the response',
  })
  @ApiBody({
    type: CreateAppointmentDto,
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Res() res: Response,
  ) {
    const item = await this.appointmentService.create(createAppointmentDto);
    if (
      item instanceof InternalServerErrorException ||
      item instanceof NotFoundException ||
      item instanceof ConflictException ||
      item instanceof HttpException
    ) {
      return (
        (item as InternalServerErrorException) ||
        NotFoundException ||
        ConflictException ||
        HttpException
      );
    } else {
      sendSuccessResponse(res, HttpStatusCodes.CREATED, item);
    };
  };

  @Get('/')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all  appointments' })
  @ApiResponse({
    status: 200,
    description: 'It will list all appointments in the response',
  })
  @StandardResponse({
    isPaginated: true,
    defaultLimit: 100,
  })
  async findAll(
    @Query() pagination: AppointmentPagination,
    @StandardParam() standardParam: StandardParams,
  ) {
    const item = await this.appointmentService.find(pagination);
    if (
      item instanceof InternalServerErrorException ||
      item instanceof HttpException ||
      item instanceof BadRequestException
    ) {
      return item as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = item;
      standardParam.setPaginationInfo({ 
        count: totalCount,
        limit: data.length, 
      });
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
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const item = await this.appointmentService.findOne(id);
    if (
      item instanceof InternalServerErrorException ||
      item instanceof NotFoundException ||
      item instanceof HttpException
    ) {
      return (
        (item as InternalServerErrorException) ||
        NotFoundException ||
        HttpException
      );
    } else {
     return sendSuccessResponse(res, HttpStatusCodes.OK, item);
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
    type: UpdateAppointmentDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Res() res: Response
  ) {
    const item = await this.appointmentService.update(id, updateAppointmentDto);

    if (
      item instanceof InternalServerErrorException ||
      item instanceof NotFoundException ||
      item instanceof HttpException
    ) {
      return (
        (item as InternalServerErrorException) ||
        HttpException ||
        NotFoundException
      );
    } else {
      return sendSuccessResponse(res,HttpStatusCodes.OK,item);
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
    const item = await this.appointmentService.delete(id);

    if (
      item instanceof InternalServerErrorException ||
      item instanceof NotFoundException ||
      item instanceof HttpException
    ) {
      return (
        (item as InternalServerErrorException) ||
        HttpException ||
        NotFoundException
      );
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
      return (item as InternalServerErrorException) || NotFoundException;
    }
    return item;
  }
}
