import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, InternalServerErrorException, ConflictException, HttpException, Query } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetPagination } from './dto/pet-pagination.dto';
@ApiTags('Pet')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) { }

  @Post()
  async create(@Body() createPetDto: CreatePetDto) {
    const pet = await this.petService.createPet(createPetDto)

    if (pet instanceof InternalServerErrorException
      || pet instanceof NotFoundException
      || pet instanceof ConflictException
      || pet instanceof HttpException
    ) {
      return pet as InternalServerErrorException || NotFoundException || ConflictException || HttpException;
    } else {
      return pet;
    }
  }

  @Get()
  @StandardResponse({
    isPaginated: true,
  })
  async findAll(
    @Query() pagination: PetPagination,
    @StandardParam() standardParam: StandardParams
  ) {
    const allPet = await this.petService.findAllPet(pagination);
    if (allPet instanceof InternalServerErrorException ||
      allPet instanceof HttpException
    ) {
      return allPet as HttpException | InternalServerErrorException;
    } else {
      const { data, totalCount } = allPet;
      standardParam.setPaginationInfo({ count: totalCount });
      return data;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pet = await this.petService.findOnePet(id)
    if (pet instanceof InternalServerErrorException
      || pet instanceof NotFoundException
      || pet instanceof HttpException
    ) {
      return pet as InternalServerErrorException || NotFoundException || HttpException;
    } else {
      return pet;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    const pet = await this.petService.updatePet(id, updatePetDto);

    if (pet instanceof InternalServerErrorException
      || pet instanceof NotFoundException
      || pet instanceof HttpException

    ) {
      return pet as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return pet;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const pet = await this.petService.deletePet(id)

    if (pet instanceof InternalServerErrorException
      || pet instanceof NotFoundException
      || pet instanceof HttpException

    ) {
      return pet as InternalServerErrorException || HttpException || NotFoundException;
    } else {
      return pet;
    }
  }
}
