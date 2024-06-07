import {
    InternalServerErrorException,
    HttpException,
    ConflictException,
    NotFoundException,
    Inject,
    BadRequestException
} from "@nestjs/common";
import { ICity } from "./city.interface";
import { CreateCityDto } from "./dto/create-city.dto";
import { CityPagination } from "./dto/city-pagination.dto";
import { City } from "src/database/dabaseModels/city.entity";

export class CityRepository implements ICity {
    constructor(
        @Inject('CITY_REPOSITORY')
        private readonly cityModel: typeof City
    ) { };

    public async create(createCityDto: CreateCityDto): Promise<
        object |
        InternalServerErrorException |
        HttpException |
        ConflictException |
        NotFoundException
    > {
        try {
            const existCity = await this.cityModel.findOne({
                where: { city_name: createCityDto.city_name }
            })
            if (existCity) {
                throw new ConflictException("City already exists , choose other name");

            }
            const newCity = await this.cityModel.create({
                city_name: createCityDto.city_name
            })
            return newCity
        } catch (error) {
            console.log("error", error);
            throw new InternalServerErrorException(error.message);
        };
    };

    public async find(pagination: CityPagination): Promise<
        InternalServerErrorException |
        NotFoundException |
        { data: object[]; totalCount: number; }
    > {
        try {
            if (pagination.page === undefined && pagination.limit === undefined) {
                const allCity = await this.cityModel.findAll();
                if (!allCity) {
                    return new NotFoundException('No City found!');
                } else {
                    return {
                        data: allCity,
                        totalCount: 1
                    };
                };
            };

            if (
                (pagination.limit === undefined && pagination.page) ||
                (pagination.limit && pagination.page === undefined)
            ) {
                return new BadRequestException('Please provide page and limit');
            } else {
                console.log("pagination", pagination)
                const { count, rows: allCity } = await this.cityModel.findAndCountAll({
                    attributes: [
                        'id',
                        'city_name',
                        'status',
                        'created_at',
                        'updated_at',
                    ],
                    limit: pagination.limit,
                    offset: (pagination.page - 1) * pagination.limit
                });

                console.log("allCity", allCity)

                const numberOfPage = Math.ceil(count / pagination.limit);

                if (!allCity || count === 0) {
                    return new NotFoundException('No city found!');
                } else {
                    return {
                        data: allCity,
                        totalCount: numberOfPage
                    };
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error.message)
        };
    };
};