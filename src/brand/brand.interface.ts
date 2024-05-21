import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BrandPagination } from "./dto/pagination-brand.dto";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

export interface IBrand {
    findAllBrand(pagination: BrandPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    createBrand(createBrandDto: CreateBrandDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOneBrand(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    updateBrand(id: string,updateBrandDto: UpdateBrandDto): Promise<object  | ConflictException | InternalServerErrorException | NotFoundException | HttpException>
    deleteBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> 
}