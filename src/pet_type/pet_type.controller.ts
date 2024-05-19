import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, HttpException, NotFoundException, Query } from '@nestjs/common';
import { PetTypeService } from './pet_type.service';
import { CreatePetTypeDto } from './dto/create-pet_type.dto';
import { UpdatePetTypeDto } from './dto/update-pet_type.dto';
import { ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetTypePagination } from './dto/pet-type-pagination.dto';
@ApiTags('Pet Types')
@Controller('pet-type')
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) { }

  @Post('')

  async create(@Body() createPetTypeDto: CreatePetTypeDto

  ) {
    const petType = await this.petTypeService.createPetType(createPetTypeDto)

    if (petType instanceof InternalServerErrorException
      || petType instanceof NotFoundException
    ) {
      return petType as InternalServerErrorException || NotFoundException;
    } else {
      return petType;
    }
  }

  @Get()
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: PetTypePagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const allPetTypes = await this.petTypeService.findAllPetType(pagination);
    if (allPetTypes instanceof InternalServerErrorException ||
      allPetTypes instanceof HttpException
    ) {
      return allPetTypes as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allPetTypes;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const petType = await this.petTypeService.findOnePetType(id)
    if (petType instanceof InternalServerErrorException
      || petType instanceof NotFoundException
    ) {
      return petType as InternalServerErrorException || NotFoundException;
    } else {
      return petType;
    }
  };

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetTypeDto: UpdatePetTypeDto) {
    const petType = await this.petTypeService.updatePetType(id, updatePetTypeDto);

    if (petType instanceof InternalServerErrorException
      || petType instanceof NotFoundException
    ) {
      return petType as InternalServerErrorException || NotFoundException;
    } else {
      return petType;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const petType = await this.petTypeService.deletePetType(id)

    if (petType instanceof InternalServerErrorException
      || petType instanceof NotFoundException
    ) {
      return petType as InternalServerErrorException || NotFoundException;
    } else {
      return petType;
    }
  }
}
