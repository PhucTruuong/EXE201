import { InternalServerErrorException, HttpException, ConflictException, NotFoundException, Inject } from "@nestjs/common";
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
    ) { }
    async create(createLocationDto: CreateLocationDto): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {
        try {
            const existing = await this.locationModel.findOne({
                where: {
                    location_name: createLocationDto.location_name,
                }
            })
            if (existing) {
                throw new ConflictException("Items already exists , choose other name");
            }
            const existingCity = await this.cityModel.findOne({
                where: {
                    id: createLocationDto.city_id,
                }
            })
            if (!existingCity) {
                throw new NotFoundException("City not found ");
            }
            const new_item = await this.locationModel.create({
                location_name: createLocationDto.location_name,
                location_address: createLocationDto.location_address,
                city_id: createLocationDto.city_id,
            })
            return new_item
        } catch (error) {
            console.log("error", error)
            throw new InternalServerErrorException("Error create location", error)
        };
    }
  async  delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const location = await this.locationModel.findOne({
                where: { id: id }
            })
            if (!location) {
                throw new NotFoundException("item  not found");
            }
            await this.locationModel.destroy({
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
  async  find(pagination: LocationPagination): Promise<InternalServerErrorException | NotFoundException | { data: object[]; totalCount: number; }> {
    try {
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
            include:[{model:City,required:true}]
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
        throw new InternalServerErrorException("Error fetching location ", error)
    };
    }
 async   findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.locationModel.findOne({
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
  async  update(id: string, updateLocationDto: UpdateLocationDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const item = await this.locationModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            const duplicateName = await this.locationModel.findOne({
                where: {
                    location_name: updateLocationDto.location_name,
                }
            })
            if(duplicateName){
                throw new ConflictException("Duplicate location name");
            }
            const updated = await this.locationModel.update(

                {
                    location_name: updateLocationDto.location_name,
                    location_address: updateLocationDto.location_address,
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