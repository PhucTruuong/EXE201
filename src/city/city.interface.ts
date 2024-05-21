import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CityPagination } from "./dto/city-pagination.dto"
import { CreateCityDto } from "./dto/create-city.dto";

export interface ICity {
    find(pagination: CityPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    create(createCityDto: CreateCityDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
}