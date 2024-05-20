import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Query, HttpException } from '@nestjs/common';
import { PetBreedService } from './pet_breed.service';
import { CreatePetBreedDto } from './dto/create-pet_breed.dto';
import { UpdatePetBreedDto } from './dto/update-pet_breed.dto';
import { ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetBreedPagination } from './dto/pagination-pet-breed.dto';
@ApiTags('Pet Breeds')
@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) { }

  @Post()
  async create(@Body() createPetBreedDto: CreatePetBreedDto) {
    const petBreeds = await this.petBreedService.createPetBreed(createPetBreedDto);

    if (petBreeds instanceof InternalServerErrorException
      || petBreeds instanceof NotFoundException
    ) {
      return petBreeds as InternalServerErrorException || NotFoundException;
    } else {
      return petBreeds;
    }
  }
  @Get()
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: PetBreedPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const allPetBreeds = await this.petBreedService.findAllPetBreed(pagination);
    if (allPetBreeds instanceof InternalServerErrorException ||
      allPetBreeds instanceof HttpException
    ) {
      return allPetBreeds as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allPetBreeds;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const petBreed = await this.petBreedService.findOnePetBreed(id)
    if (petBreed instanceof InternalServerErrorException
      || petBreed instanceof NotFoundException
    ) {
      return petBreed as InternalServerErrorException || NotFoundException;
    } else {
      return petBreed;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetBreedDto: UpdatePetBreedDto) {
    const petBreed = await this.petBreedService.updatePetType(id, updatePetBreedDto);

    if (petBreed instanceof InternalServerErrorException
      || petBreed instanceof NotFoundException
    ) {
      return petBreed as InternalServerErrorException || NotFoundException;
    } else {
      return petBreed;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const petType = await this.petBreedService.deletePetBreed(id)

    if (petType instanceof InternalServerErrorException
      || petType instanceof NotFoundException
    ) {
      return petType as InternalServerErrorException || NotFoundException;
    } else {
      return petType;
    }
  }
}
