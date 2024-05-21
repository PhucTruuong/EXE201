import { Brand } from "src/database/dabaseModels/brand.entity";
import { IBrand } from "./brand.interface";
import { ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { BrandPagination } from "./dto/pagination-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
@Injectable()
export class BrandRepository implements IBrand {
    constructor(
        @Inject('BRAND_REPOSITORY')
        private readonly brandModel: typeof Brand,
    ) { }
    async createBrand(createBrandDto: CreateBrandDto): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {
        try {
            const existingBrand = await this.brandModel.findOne({
                where: {
                    brand_name: createBrandDto.brand_name,
                }
            })
            if (existingBrand) {
                throw new ConflictException("Brand  already exists , choose other name");
            }
            const newBrand = await this.brandModel.create({
                brand_name: createBrandDto.brand_name,
                brand_description: createBrandDto.brand_description


            })
            return newBrand
        } catch (error) {
            console.log("error", error)
            throw new InternalServerErrorException("Error create brand", error)
        };
    }
    async findAllBrand(pagination: BrandPagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | HttpException> {
        try {
            const { count, rows: allBrand } = await this.brandModel.findAndCountAll({
                attributes: [
                    'id',
                    'brand_name',
                    'brand_description',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });
            if (!allBrand || count === 0) {
                return new HttpException('No Pet  found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allBrand,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching brand ", error)
        };
    }
    async findOneBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const brand = await this.brandModel.findOne({
                where: { id: id }
            })
            if (!brand) {
                throw new NotFoundException("brand  not found");
            }
            return brand
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find one  brand ", error)
        };
    }
    async updateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<object | InternalServerErrorException | HttpException | NotFoundException | ConflictException> {
        try {
            const pet = await this.brandModel.findOne({
                where: { id: id }
            })
            if (!pet) {
                throw new NotFoundException("brand  not found");
            }
            const duplicateName = await this.brandModel.findOne({
                where: {
                    brand_name: updateBrandDto.brand_name,
                }
            })
            if(duplicateName){
                throw new ConflictException("Duplicate brand name");
            }
            const BrandUpdated = await this.brandModel.update(

                {
                    brand_name: updateBrandDto.brand_name,
                    brand_description: updateBrandDto.brand_description,
                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            )
            return BrandUpdated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update one brand ", error)
        };
    }
   async  deleteBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const brand = await this.brandModel.findOne({
                where: { id: id }
            })
            if (!brand) {
                throw new NotFoundException("brand  not found");
            }
            await this.brandModel.destroy({
                where: { id: id }
            })
            return {
                message: "brand  deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one brand ", error)
        };  
    }
}




