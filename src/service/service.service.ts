import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './service.repository';
import { ServicePagination } from './dto/pagination-service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository
  ){}
 public async find(pagination: ServicePagination): Promise<{
    data: object[],
    totalCount: number
} | InternalServerErrorException | NotFoundException>{
  return this.serviceRepository.find(pagination)
}
public async create(createServiceDto : CreateServiceDto): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
>{
  return this.serviceRepository.create(createServiceDto)
}
public async findOne(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>{
  return this.serviceRepository.findOne(id)
}
public async update(id: string,updateServiceDto: UpdateServiceDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>{
  return this.serviceRepository.update(id,updateServiceDto)
}
public async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
  return this.serviceRepository.delete(id)
}
}
