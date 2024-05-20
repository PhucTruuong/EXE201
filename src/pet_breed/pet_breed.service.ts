import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePetBreedDto } from './dto/create-pet_breed.dto';
import { UpdatePetBreedDto } from './dto/update-pet_breed.dto';
import { PetBreedRepository } from './pet_breed.repository';
import { PetBreedPagination } from './dto/pagination-pet-breed.dto';

@Injectable()
export class PetBreedService {
  constructor(private readonly petBreedRepository: PetBreedRepository) { }

  public async findAllPetBreed(pagination: PetBreedPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {
    return this.petBreedRepository.findAllPetBreed(pagination);
  }

  public async createPetBreed(createPetBreedDto: CreatePetBreedDto): Promise<object | InternalServerErrorException | HttpException | ConflictException> {
    return this.petBreedRepository.createPetBreed(createPetBreedDto);
  }
  public async findOnePetBreed(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return this.petBreedRepository.findOnePetBreed(id)
  }
  public async deletePetBreed(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return  this.petBreedRepository.deletePetBreed(id);

  }
  public async updatePetType(id: string, updatePetBreedDto: UpdatePetBreedDto): Promise<object | InternalServerErrorException | HttpException> {
    return this.petBreedRepository.updatePetBreed(id,updatePetBreedDto)
  }
}
