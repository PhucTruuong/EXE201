import {
    InternalServerErrorException,
    HttpException,
    ConflictException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { LocationPagination } from "./dto/pagination-location.dto";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

export interface ILocation {
    find(pagination: LocationPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException | BadRequestException>;

    create(createLocationDto: CreateLocationDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >;
    findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<
        object | InternalServerErrorException | NotFoundException | HttpException>;
    delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>
};