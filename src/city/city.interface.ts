import {
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { CityPagination } from "./dto/city-pagination.dto"
import { CreateCityDto } from "./dto/create-city.dto";

export interface ICity {
    find(pagination: CityPagination): Promise<
        {
            data: object[],
            totalCount: number
        } |
        InternalServerErrorException |
        NotFoundException |
        BadRequestException
    >;
    create(createCityDto: CreateCityDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
}