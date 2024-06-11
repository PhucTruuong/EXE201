import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentPagination } from './dto/pagination-appointment.dto';
import { RequestWithUser } from 'src/interface/request-interface';
import { AppointmentRepository } from './appointment.repository';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }
  public async find(pagination: AppointmentPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | NotFoundException> {
    return this.appointmentRepository.find(pagination)
  };

  public async create(createAppointmentDto: CreateAppointmentDto): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  > {
    return this.appointmentRepository.create(createAppointmentDto)
  };

  public async findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.appointmentRepository.findOne(id)
  };

  public async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
    return this.appointmentRepository.update(id, updateAppointmentDto)
  };

  public async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.appointmentRepository.delete(id)
  };

  public async findByUser(req: RequestWithUser): Promise<object | InternalServerErrorException | NotFoundException> {
    return this.appointmentRepository.findByUser(req)
  };

  public async confirmAppointment(appointment_id: string): Promise<
    object | InternalServerErrorException | NotFoundException
  > {
    return this.appointmentRepository.confirmAppointment(appointment_id)
  };

  public async getHostAppointments(req: RequestWithUser, pagination: AppointmentPagination): Promise<
    {
      data: object[],
      totalCount: number
    } | InternalServerErrorException | NotFoundException
  > {
    return this.appointmentRepository.getHostAppointments(req, pagination);
  };
}
