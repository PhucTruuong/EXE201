import { InternalServerErrorException, HttpException, ConflictException, NotFoundException, Inject } from "@nestjs/common";
import { IBooking } from "./booking.interface";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingPagination } from "./dto/pagination-booking.dto";
import { RequestWithUser } from "src/interface/request-interface";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { Booking } from "src/database/dabaseModels/booking.entity";
import { Appointment } from "src/database/dabaseModels/appointment.entity";
import { User } from "src/database/dabaseModels/user.entity";

export class BookingRepository implements IBooking {
    constructor(
        @Inject('BOOKING_REPOSITORY')
        private readonly bookingModel: typeof Booking,
        @Inject('APPOINTMENT_REPOSITORY')
        private readonly appointmentModel: typeof Appointment,
        @Inject('USER_REPOSITORY')
        private readonly userModel: typeof User,
    ) { }
    async create(createBookingDto: CreateBookingDto, req: RequestWithUser): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {
        try {
            const existAppointment = await this.appointmentModel.findOne({
                where: { id: createBookingDto.appointment_id }

            })
            if (!existAppointment) {
                return new NotFoundException('Appointment Not Found')
            }
            const bookings = await this.bookingModel.create({
                user_id: req.user.userId,
                appointment_id: createBookingDto.appointment_id,
                booking_date: createBookingDto.booking_date,

            })
            return bookings;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error create booking", error)
        }

    }
    async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.bookingModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            await this.bookingModel.destroy({
                where: { id: id }
            })
            return {
                message: "item deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one item ", error)
        };

    }
    async find(pagination: BookingPagination): Promise<InternalServerErrorException | NotFoundException | { data: object[]; totalCount: number; }> {
        try {
            const { count, rows: allItem } = await this.bookingModel.findAndCountAll({
                attributes: [
                    'id',
                    'booking_date',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [
                    {
                        model: this.appointmentModel,
                        as: 'appointment',
                    },
                    {
                        model: this.userModel,
                        as: 'user',
                    },

                ]
            });
            if (!allItem || count === 0) {
                return new NotFoundException()
            } else {
                return {
                    data: allItem,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching  ", error)
        };
    }
    async findByUser(req: RequestWithUser, pagination: BookingPagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | NotFoundException> {
        try {
            const { count, rows: allItem } = await this.bookingModel.findAndCountAll({
                where: { user_id: req.user.userId },
                attributes: [
                    'id',
                    'booking_date',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [
                    {
                        model: this.appointmentModel,
                        as: 'appointment',
                    },
                    // {
                    //     model: this.userModel,
                    //     as: 'user',
                    // },

                ]
            });
            if (!allItem || count === 0) {
                return new NotFoundException()
            } else {
                return {
                    data: allItem,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching  ", error)
        };
    }
    async findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.bookingModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            return item
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find item ", error)
        };
    }
    async update(id: string, updateBookingDto: UpdateBookingDto): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.bookingModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            const updated = await this.bookingModel.update(
                {
                    appointment_id: updateBookingDto.appointment_id,
                    booking_date: updateBookingDto.booking_date,

                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            )
            return updated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update item ", error)
        };
    }
}