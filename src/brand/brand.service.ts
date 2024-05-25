import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from './brand.repository';
import { BrandPagination } from './dto/pagination-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository
  ) { }
  public async findAllBrand(pagination: BrandPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {
    return this.brandRepository.findAllBrand(pagination)
  }

  public async createBrand(createBrandDto: CreateBrandDto & { image: Express.Multer.File; }): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  > {
    return this.brandRepository.createBrand(createBrandDto);
  }
  public async findOneBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.brandRepository.findOneBrand(id)
  }
  public async updateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<object | ConflictException | InternalServerErrorException | NotFoundException | HttpException> {
    return this.brandRepository.updateBrand(id, updateBrandDto)
  }
  public async deleteBrand(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.brandRepository.deleteBrand(id)
  }
}
