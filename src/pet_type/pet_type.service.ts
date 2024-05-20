import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePetTypeDto } from './dto/create-pet_type.dto';
import { UpdatePetTypeDto } from './dto/update-pet_type.dto';
import { PetTypeRepository } from './pet_type.repository';
import { PetTypePagination } from './dto/pet-type-pagination.dto';

@Injectable()
export class PetTypeService {
  constructor(private readonly petTypeRepository: PetTypeRepository) { }
  public async findAllPetType(pagination: PetTypePagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {
    return this.petTypeRepository.findAllPetType(pagination);
  }

  public async createPetType(createPetType: CreatePetTypeDto): Promise<object | InternalServerErrorException | HttpException | ConflictException> {
    return this.petTypeRepository.createPetType(createPetType)
  }
  public async findOnePetType(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return this.petTypeRepository.findOnePetType(id)
  }
  public async deletePetType(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return this.petTypeRepository.deletePetType(id);

  }
  public async updatePetType(id: string, updatePetType: UpdatePetTypeDto): Promise<object | InternalServerErrorException | HttpException> {
    return this.petTypeRepository.updatePetType(id,updatePetType)
  }
}
