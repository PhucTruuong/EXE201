import {
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { BrandPagination } from "./dto/pagination-brand.dto";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

export interface IBrand {
    findAllBrand(pagination: BrandPagination): Promise<{
        data: object[],
        totalCount: number
    } |
        InternalServerErrorException |
        BadRequestException
    >;
    createBrand(createBrandDto: CreateBrandDto & { image: Express.Multer.File }): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOneBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    updateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<object | ConflictException | InternalServerErrorException | NotFoundException | HttpException>
    deleteBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>
}