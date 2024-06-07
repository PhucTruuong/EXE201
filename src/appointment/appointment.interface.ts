import {
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { AppointmentPagination } from "./dto/pagination-appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { RequestWithUser } from "src/interface/request-interface";

export interface IAppointment {
    find(pagination: AppointmentPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException | BadRequestException>;
    create(createAppointmentDto: CreateAppointmentDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >;
    findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<
        object | InternalServerErrorException | NotFoundException | HttpException
    >;
    delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>;
    findByUser(req: RequestWithUser): Promise<object | InternalServerErrorException | NotFoundException>;
};