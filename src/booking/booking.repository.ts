import {
  InternalServerErrorException,
  HttpException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IBooking } from './booking.interface';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingPagination } from './dto/pagination-booking.dto';
import { RequestWithUser } from 'src/interface/request-interface';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from 'src/database/dabaseModels/booking.entity';
import { Appointment } from 'src/database/dabaseModels/appointment.entity';
import { User } from 'src/database/dabaseModels/user.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Service } from 'src/database/dabaseModels/service.entity';

export class BookingRepository implements IBooking {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private readonly bookingModel: typeof Booking,
    @Inject('APPOINTMENT_REPOSITORY')
    private readonly appointmentModel: typeof Appointment,

    @Inject('SERVICE_REPOSITORY')
    private readonly serviceModel: typeof Service,
    @Inject('USER_REPOSITORY')
    private readonly userModel: typeof User,
    private readonly paymentService: PaymentService,
  ) {}
  async create(
    createBookingDto: CreateBookingDto,
    req: RequestWithUser,
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | ConflictException
    | NotFoundException
  > {
    try {
      const existAppointment = await this.appointmentModel.findOne({
        where: { id: createBookingDto.appointment_id },
        include: {
          model: this.serviceModel,
          as: 'service',
          attributes:['id']
        },
      });
      if (!existAppointment) {
        return new NotFoundException('Appointment Not Found');
      }
      const service = await this.serviceModel.findOne({
        where:{id: existAppointment.service_id}
      })
      const bookings = await this.bookingModel.create({
        user_id: req.user.userId,
        appointment_id: createBookingDto.appointment_id,
        booking_date: createBookingDto.booking_date,
        status_string: 'not_paid',
      });
      const data = await this.paymentService.create(bookings, service?.price);
      return { ...data, bookings };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error create booking', error);
    }
  }

  async delete(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const item = await this.bookingModel.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      await this.bookingModel.destroy({
        where: { id: id },
      });
      return {
        message: 'item deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error delete one item ', error);
    }
  }
  async find(
    pagination: BookingPagination,
  ): Promise<
    | InternalServerErrorException
    | NotFoundException
    | { data: object[]; totalCount: number }
  > {
    try {
      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;
      const findOptions: any = {
        attributes: [
          'id',
          'booking_date',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: this.appointmentModel,
            as: 'appointment',
          },
          {
            model: this.userModel,
            as: 'user',
          },
        ],
      };
      const { count, rows: allItem } =
        await this.bookingModel.findAndCountAll(findOptions);
      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }
      if (!allItem || count === 0) {
        return new NotFoundException();
      } else {
        return {
          data: allItem,
          totalCount: count,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error fetching  ', error);
    }
  }
  async findByUser(
    req: RequestWithUser,
    pagination: BookingPagination,
  ): Promise<
    | { data: object[]; totalCount: number }
    | InternalServerErrorException
    | NotFoundException
  > {
    try {
      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;
      const findOptions: any = {
        where: { user_id: req.user.userId },
        attributes: [
          'id',
          'booking_date',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: this.appointmentModel,
            as: 'appointment',
          },
          // {
          //     model: this.userModel,
          //     as: 'user',
          // },
        ],
      };
      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }
      const { count, rows: allItem } =
        await this.bookingModel.findAndCountAll(findOptions);
      if (!allItem || count === 0) {
        return new NotFoundException();
      } else {
        return {
          data: allItem,
          totalCount: count,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error fetching  ', error);
    }
  }
  async findOne(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const item = await this.bookingModel.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      return item;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error find item ', error);
    }
  }
  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const item = await this.bookingModel.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      const updated = await this.bookingModel.update(
        {
          appointment_id: updateBookingDto.appointment_id,
          booking_date: updateBookingDto.booking_date,

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
    }
  }
}
