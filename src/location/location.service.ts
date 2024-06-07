import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationPagination } from './dto/pagination-location.dto';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) { };

  public async find(pagination: LocationPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | NotFoundException> {
    return this.locationRepository.find(pagination)
  };

  public async create(createLocationDto: CreateLocationDto): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  > {
    return this.locationRepository.create(createLocationDto)
  };

  public async findOne(id: string): Promise<object |
    InternalServerErrorException | HttpException | NotFoundException> {
    return this.locationRepository.findOne(id)
  };

  public async update(id: string, updateLocationDto: UpdateLocationDto): Promise<object |
    InternalServerErrorException | NotFoundException | HttpException> {
    return this.locationRepository.update(id, updateLocationDto)
  };

  public async delete(id: string): Promise<object |
    InternalServerErrorException | HttpException | NotFoundException> {
    return this.locationRepository.delete(id)
  };
};
