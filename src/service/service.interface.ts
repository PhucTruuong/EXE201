import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { ServicePagination } from "./dto/pagination-service";
import { UpdateServiceDto } from "./dto/update-service.dto";



export interface IService {
    find(pagination: ServicePagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException>;
    create(createServiceDto : CreateServiceDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOne(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    update(id: string,updateServiceDto: UpdateServiceDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>
    delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> 
}