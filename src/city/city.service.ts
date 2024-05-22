import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { CityRepository } from './city.repository';
import { CityPagination } from './dto/city-pagination.dto';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository
  ) { }
  public async find(pagination: CityPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {

    return this.cityRepository.find(pagination)
  }

  public async create(createCityDto: CreateCityDto): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  >{
    return this.cityRepository.create(createCityDto)
  }
}
