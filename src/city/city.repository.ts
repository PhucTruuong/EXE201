import { InternalServerErrorException, HttpException, ConflictException, NotFoundException, Inject, HttpStatus } from "@nestjs/common";
import { ICity } from "./city.interface";
import { CreateCityDto } from "./dto/create-city.dto";
import { CityPagination } from "./dto/city-pagination.dto";
import { City } from "src/database/dabaseModels/city.entity";

export class CityRepository implements ICity {
    constructor(
        @Inject('CITY_REPOSITORY')
        private readonly cityModel: typeof City
    ) { }
    async create(createCityDto: CreateCityDto): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {
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
            console.log("error", error)
            throw new InternalServerErrorException("Error create city", error)
        };
    }
   async find(pagination: CityPagination): Promise<HttpException | InternalServerErrorException | { data: object[]; totalCount: number; }> {
        try {
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
            if (!allCity || count === 0) {
                return new HttpException('No City  found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allCity,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching cities ", error)
        };
    }
}