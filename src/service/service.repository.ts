import { InternalServerErrorException, NotFoundException, HttpException, ConflictException, Inject } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { IService } from "./service.interface";
import { Service } from "src/database/dabaseModels/service.entity";
import { Brand } from "src/database/dabaseModels/brand.entity";
import { Category } from "src/database/dabaseModels/category.entity";
import { ServicePagination } from "./dto/pagination-service";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Location } from "src/database/dabaseModels/location.entity";

export class ServiceRepository implements IService {
    constructor(
        @Inject('SERVICE_REPOSITORY')
        private readonly serviceModel: typeof Service,
        @Inject('LOCATION_REPOSITORY')
        private readonly locationModel: typeof Location,
        @Inject('BRAND_REPOSITORY')
        private readonly brandModel: typeof Brand,
        @Inject('CATEGORY_REPOSITORY')
        private readonly categoryModel: typeof Category,
    ) {

    }
   async create(createServiceDto: CreateServiceDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException | ConflictException> {
        try {
            const existing = await this.serviceModel.findOne({
                where: {
                    service_name:createServiceDto.service_name,
                }
            })
            if (existing) {
                throw new ConflictException("Items already exists , choose other name");
            }
            const existingBrand = await this.brandModel.findOne({
                where: {
                    id: createServiceDto.brand_id,
                }
            })
            if (!existingBrand) {
                throw new NotFoundException("Brand not found ");
            }
            const existingLocation = await this.locationModel.findOne({
                where: {
                    id: createServiceDto.location_id,
                }
            })
            if (!existingLocation) {
                throw new NotFoundException("item not found ");
            }
            const existingCategory = await this.categoryModel.findOne({
                where: {
                    id: createServiceDto.category_id,
                }
            })
            if (!existingCategory) {
                throw new NotFoundException("Category not found ");
            }
        

            const new_item = await this.serviceModel.create({
                service_name: createServiceDto.service_name,
                service_description: createServiceDto.service_description,
                startTime: createServiceDto.startTime,
                endTime: createServiceDto.endTime,
                brand_id: createServiceDto.brand_id,
                category_id: createServiceDto.category_id,
                location_id: createServiceDto.location_id,
                
            })
            return new_item
        } catch (error) {
            console.log("error", error)
            throw new InternalServerErrorException("Error create item", error)
        };  
    }
   async find(pagination: ServicePagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | NotFoundException> {
        try {
            const { count, rows: allItem } = await this.serviceModel.findAndCountAll({
                attributes: [
                    'id',
                    'service_name',
                    'service_description',
                    'starttime',
                    'endtime',
                    // 'brand_id',
                    // 'location_id',
                    // 'category_id',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [
                    {
                        model: Brand, 
                        as: 'brand', 
                        attributes: ['id', 'brand_name'] 
                    },
                    {
                        model: Location, 
                        as: 'location',
                        attributes: ['id', 'location_name', 'location_address'] 
                    },
                    {
                        model: Category, 
                        as: 'category',
                        attributes: ['id', 'category_name'] 
                    }
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
            throw new InternalServerErrorException("Error fetching services ", error)
        };
    }
   async findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.serviceModel.findOne({
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
   async update(id: string, updateServiceDto: UpdateServiceDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const item = await this.serviceModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            const duplicateName = await this.serviceModel.findOne({
                where: {
                    service_name: updateServiceDto.service_name,
                }
            })
            if(duplicateName){
                throw new ConflictException("Duplicate  name!");
            }
            const updated = await this.serviceModel.update(

                {
                    service_name: updateServiceDto.service_name,
                    service_description: updateServiceDto.service_description,
                    startTime: updateServiceDto.startTime,
                    endTime: updateServiceDto.endTime,
                    brand_id: updateServiceDto.brand_id,
                    category_id: updateServiceDto.category_id,
                    location_id: updateServiceDto.location_id,
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
   async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.serviceModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            await this.serviceModel.destroy({
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
}