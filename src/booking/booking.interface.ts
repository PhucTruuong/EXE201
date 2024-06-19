import {
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common"; ``
import { RequestWithUser } from "src/interface/request-interface";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { BookingPagination } from "./dto/pagination-booking.dto";

export interface IBooking {
    find(pagination: BookingPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException | BadRequestException>;

    create(createBookingDto: CreateBookingDto, req: RequestWithUser): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOne(id: string): Promise<
        object | InternalServerErrorException | HttpException | NotFoundException
    >;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<
        object | InternalServerErrorException | NotFoundException | HttpException
    >;
    delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>;
    findByUser(req: RequestWithUser, pagination: BookingPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException>;
};