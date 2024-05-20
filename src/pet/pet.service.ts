import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetPagination } from './dto/pet-pagination.dto';
import { PetRepository } from './pet.repository';

@Injectable()
export class PetService {
  constructor(private readonly petRepository: PetRepository

  ) { }

  public async findAllPet(pagination: PetPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {
    return this.petRepository.findAllPet(pagination);

  }
  public async createPet(createPetDto: CreatePetDto): Promise<
    object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
  > {
    return this.petRepository.createPet(createPetDto)
  }
  public async findOnePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.petRepository.findOnePet(id)
  }
  public async updatePet(id: string, updatePetDto: UpdatePetDto): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.petRepository.updatePet(id, updatePetDto)
  }
  public async deletePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
    return this.petRepository.deletePet(id)
  }
}


