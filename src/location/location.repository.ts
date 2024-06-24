import {
    InternalServerErrorException,
    HttpException,
    ConflictException,
    NotFoundException,
    Inject,
    BadRequestException
} from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { ILocation } from "./location.interface";
import { LocationPagination } from "./dto/pagination-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "src/database/dabaseModels/location.entity";
import { City } from "src/database/dabaseModels/city.entity";

export class LocationRepository implements ILocation {
    constructor(
        @Inject('LOCATION_REPOSITORY')
        private readonly locationModel: typeof Location,
        @Inject('CITY_REPOSITORY')
        private readonly cityModel: typeof City,
    ) { };

    public async create(createLocationDto: CreateLocationDto): Promise<
        object |
        InternalServerErrorException |
        HttpException |
        ConflictException |
        NotFoundException
    > {
        try {
            const existing = await this.locationModel.findOne({
                where: {
                    location_name: createLocationDto.location_name,
                }
            });

            if (existing) {
                throw new ConflictException("This location has already existed, choose other ones!");
            };

            const existingCity = await this.cityModel.findOne({
                where: {
                    id: createLocationDto.city_id,
                }
            });

            if (!existingCity) {
                throw new NotFoundException("This city does not exist!");
            };

            const new_item = await this.locationModel.create({
                location_name: createLocationDto.location_name,
                location_address: createLocationDto.location_address,
                city_id: createLocationDto.city_id,
            });

            return new_item;
        } catch (error) {
            console.log("error", error);
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            };

            throw new InternalServerErrorException(error.message);
        };
    };

    public async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const location = await this.locationModel.findOne({
                where: { id: id }
            });

            if (!location) {
                throw new NotFoundException("item  not found");
            };

            await this.locationModel.destroy({
                where: { id: id }
            });

            return {
                message: "item deleted successfully"
            };
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            };

            throw new InternalServerErrorException("Error delete one item ", error)
        };
    };

    public async find(pagination: LocationPagination): Promise<
        InternalServerErrorException |
        NotFoundException |
        { data: object[]; totalCount: number; }
    > {
        try {
            if (pagination.page === undefined && pagination.limit === undefined) {
                const allItem = await this.locationModel.findAll();

                return {
                    data: allItem,
                    totalCount: 1
                };
            };

            if (
                (pagination.limit === undefined && pagination.page) ||
                (pagination.limit && pagination.page === undefined)
            ) {
                throw new BadRequestException('Please provide page and limit');
            };

            const { count, rows: allItem } = await this.locationModel.findAndCountAll({
                attributes: [
                    'id',
                    'location_name',
                    'location_address',
                    'city_id',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [{ model: City, required: true }]
            });

            const numberOfPage = Math.ceil(count / pagination.limit);


            return {
                data: allItem,
                totalCount: numberOfPage
            };
        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message)
        };
    };

    public async findOne(id: string): Promise<
        object |
        InternalServerErrorException |
        HttpException |
        NotFoundException
    > {
        try {
            const item = await this.locationModel.findOne({
                where: { id: id }
            });

            if (!item) {
                throw new NotFoundException("Item not found!");
            };

            return item
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            };

            throw new InternalServerErrorException(error.message);
        };
    };

    public async update(id: string, updateLocationDto: UpdateLocationDto): Promise<
        object |
        InternalServerErrorException |
        NotFoundException |
        HttpException
    > {
        try {
            const item = await this.locationModel.findOne({
                where: { id: id }
            });

            if (!item) {
                throw new NotFoundException("This location does not exist!");
            };

            const duplicateName = await this.locationModel.findOne({
                where: {
                    location_name: updateLocationDto.location_name,
                }
            });

            if (duplicateName) {
                throw new ConflictException("Duplicate location name");
            };

            const updated = await this.locationModel.update(
                {
                    location_name: updateLocationDto.location_name,
                    location_address: updateLocationDto.location_address,
                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            );

            return updated;
        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            };
            throw new InternalServerErrorException("Error update item ", error)
        };
    };
};