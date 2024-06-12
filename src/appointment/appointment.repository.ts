import {
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  ConflictException,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { IAppointment } from './appointment.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from 'src/database/dabaseModels/appointment.entity';
import { AppointmentPagination } from './dto/pagination-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Pet } from 'src/database/dabaseModels/pet.entity';
import { Service } from 'src/database/dabaseModels/service.entity';
import { RequestWithUser } from 'src/interface/request-interface';
//import { Sequelize } from 'sequelize-typescript';

export class AppointmentRepository implements IAppointment {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private readonly appointmentModel: typeof Appointment,
    @Inject('PET_REPOSITORY')
    private readonly petModel: typeof Pet,
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceModel: typeof Service,
  ) { };

  public async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<
    | object
    | InternalServerErrorException
    | NotFoundException
    | HttpException
    | ConflictException
  > {
    try {
      console.log('createAppointmentDto: ', createAppointmentDto);

      const dateOnly = new Date(createAppointmentDto.appointment_date).toISOString().split('T')[0];

      const promises = [
        this.petModel.findOne({
          where: { id: createAppointmentDto.pet_id },
        }),

        this.serviceModel.findOne({
          where: { id: createAppointmentDto.service_id },
        }),
      ];

      const [existPet, existService] = await Promise.all(promises);

      if (!existPet) {
        return new NotFoundException('Pet Not Found!');
      };

      if (!existService) {
        return new NotFoundException('Service not found!');
      };

      const existedAppointment = await this.appointmentModel.sequelize.query(
        `
          SELECT * FROM petcare_appointment
          WHERE date_trunc('day', appointment_date) = ?
          AND appointment_time = ?
          AND service_id = ?
        `,
        {
          replacements: [
            dateOnly,
            createAppointmentDto.appointment_time,
            createAppointmentDto.service_id,
          ],
        }
      );

      console.log('Existed appointment: ', existedAppointment[0]);

      if (existedAppointment[0].length > 0) {
        console.log('There has been already an appointment at this slot!');
        return new ConflictException('There has been already an appointment at this slot!');
      };

      const appointment = await this.appointmentModel.create({
        pet_id: createAppointmentDto.pet_id,
        service_id: createAppointmentDto.service_id,
        appointment_date: createAppointmentDto.appointment_date,
        appointment_time: createAppointmentDto.appointment_time,
      });

      return appointment;
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error.message);
    };
  };

  public async find(
    pagination: AppointmentPagination,
  ): Promise<
    | { data: object[]; totalCount: number }
    | InternalServerErrorException
    | NotFoundException
    | BadRequestException
  > {
    try {
      if (pagination.limit === undefined && pagination.page === undefined) {
        const allItem = await this.appointmentModel.findAll({
          attributes: [
            'appointment_id',
            'appointment_date',
            'appointment_time',
            'status',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: this.petModel,
              as: 'pet',
            },
            {
              model: this.serviceModel,
              as: 'service',
            },
          ],
        });

        if (!allItem || allItem.length === 0) {
          return new NotFoundException('There is no appointments!');
        };

        return {
          data: allItem,
          totalCount: 1,
        };
      }

      if (
        (!pagination.limit && pagination.page) ||
        (pagination.limit && !pagination.page)
      ) {
        return new BadRequestException('Please provide limit and page!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;

      const findOptions: any = {
        attributes: [
          'appointment_id',
          'appointment_date',
          'appointment_time',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: this.petModel,
            as: 'pet',
          },
          {
            model: this.serviceModel,
            as: 'service',
          },
        ],
      };

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      };

      const { count, rows: allItem } = await this.appointmentModel.findAndCountAll(findOptions);

      const numberOfPages = Math.ceil(count / pagination.limit);

      if (!allItem || count === 0) {
        return new NotFoundException();
      } else {
        return {
          data: allItem,
          totalCount: numberOfPages,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async findOne(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      console.log('onibnd');
      const item = await this.appointmentModel.findOne({
        where: { appointment_id: id },
        include: [
          {
            model: this.petModel,
            as: 'pet',
          },
          {
            model: this.serviceModel,
            as: 'service',
          },
        ],
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      return item;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async findByUser(
    req: RequestWithUser,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    try {
      console.log(req.user);
      // find all pet that user have
      const pets = await this.petModel.findAll({
        where: { user_id: req.user.userId },
      });

      console.log('pets fopund', pets);
      if (!pets || pets.length === 0) {
        return new NotFoundException('User not found');
      };

      const petIds = pets.map((pet) => pet.id);
      //console.log('petIds', petIds);
      const appointments = await this.appointmentModel.findAll({
        where: { pet_id: petIds },
      });

      if (!appointments) {
        return new NotFoundException('There is no appointments');
      };

      return appointments;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const item = await this.appointmentModel.findOne({
        where: { appointment_id: id },
      });

      if (!item) {
        throw new NotFoundException('item  not found');
      };

      const updated = await this.serviceModel.update(
        {
          pet_id: updateAppointmentDto.pet_id,
          service_id: updateAppointmentDto.service_id,
          appointment_date: updateAppointmentDto.appointment_date,
          appointment_time: updateAppointmentDto.appointment_time,
          updateAt: new Date(),
        },
        {
          where: { id: id },
        },
      );

      return updated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error update item ', error);
    };
  };

  public async delete(
    id: string,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const item = await this.appointmentModel.findOne({
        where: { appointment_id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      await this.appointmentModel.destroy({
        where: { appointment_id: id },
      });
      return {
        message: 'item deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error delete one item ', error);
    };
  };

  public async confirmAppointment(appointment_id: string): Promise<
    object |
    InternalServerErrorException |
    NotFoundException |
    HttpException
  > {
    try {
      const appointment = await this.appointmentModel.findOne({
        where: {
          appointment_id: appointment_id,
        },
      });

      if (!appointment) {
        return new NotFoundException('This appointment does not exist!');
      };

      if (appointment.status === true) {
        return new ConflictException('This appointment has been already accepted!');
      };

      await this.appointmentModel.update(
        {
          status: true,
        },
        {
          where: { appointment_id: appointment_id },
        },
      );

      return {
        message: 'Appointment has been accepted!',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async getHostAppointments(req: RequestWithUser, pagination: AppointmentPagination): Promise<
    { data: object[], totalCount: number } | InternalServerErrorException | NotFoundException
  > {
    try {
      if (pagination.limit === undefined && pagination.page === undefined) {
        const appointments = await this.appointmentModel.findAll({
          attributes: ['appointment_id', 'appointment_date', 'appointment_time', 'status'],
          include: [
            {
              model: this.petModel,
              as: 'pet',
              attributes: ['id', 'pet_name'],
              required: true,
            },
            {
              model: this.serviceModel,
              as: 'service',
              attributes: ['id', 'service_name'],
              where: { user_id: req.user.userId },
              required: true,
            },
          ],
          group: ['appointment_id', 'service.id', 'pet.id'],
          order: [['appointment_date', 'ASC']],
        });

        if (!appointments) {
          return new NotFoundException('There is no appointment!');
        };

        return { data: appointments, totalCount: 1 };
      };

      if (
        (!pagination.limit && pagination.page) ||
        (pagination.limit && !pagination.page)
      ) {
        return new BadRequestException('Please provide limit and page!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;

      const findOptions: any = {
        attributes: ['appointment_id', 'appointment_date', 'appointment_time', 'status'],
        include: [
          {
            model: this.petModel,
            as: 'pet',
            attributes: ['id', 'pet_name'],
            required: true,
          },
          {
            model: this.serviceModel,
            as: 'service',
            attributes: ['id', 'service_name'],
            where: { user_id: req.user.userId },
            required: true,
          },
        ],
        group: ['appointment_id', 'service.id', 'pet.id'],
        order: [['appointment_date', 'ASC']],
      };

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      };

      const appointments = await this.appointmentModel.findAll(findOptions);

      const numberOfPages = Math.ceil(appointments.length / pagination.limit);

      if (!appointments || appointments.length === 0) {
        return new NotFoundException('There is no appointment');
      } else {
        return {
          data: appointments,
          totalCount: numberOfPages,
        };
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };
};
