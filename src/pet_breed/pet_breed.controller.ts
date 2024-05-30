import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, Query, HttpException, UseGuards } from '@nestjs/common';
import { PetBreedService } from './pet_breed.service';
import { CreatePetBreedDto } from './dto/create-pet_breed.dto';
import { UpdatePetBreedDto } from './dto/update-pet_breed.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetBreedPagination } from './dto/pagination-pet-breed.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
@ApiTags('Pet Breeds')
@Controller('api/v1/pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' Create a new pet breed' })
  @ApiResponse({
    status: 201,
    description: 'It will create a new pet breed in the response',
  })
  @ApiBody({
    type: CreatePetBreedDto
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' List all pet breeds' })
  @ApiResponse({
    status: 200,
    description: 'It will list  all  pet breeds in the response',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' List detail pet breed' })
  @ApiResponse({
    status: 200,
    description: 'It will return detail  pet breed in the response',
  })
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

  @Get('pet-type/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' List detail pet breed base on pet-type' })
  @ApiResponse({
    status: 200,
    description: 'It will return detail  pet breed in the response',
  })
  async findByPetType(@Param('id') id: string) {
    const petBreed = await this.petBreedService.getPetBreedByPetType(id)
    if (petBreed instanceof InternalServerErrorException
      || petBreed instanceof NotFoundException
    ) {
      return petBreed as InternalServerErrorException || NotFoundException;
    } else {
      return petBreed;
    }
  }




  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' Update pet breed' })
  @ApiResponse({
    status: 200,
    description: 'It will update a  pet breed in the response',
  })
  @ApiBody({
    type:UpdatePetBreedDto
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' delete one  pet breed' })
  @ApiResponse({
    status: 200,
    description: 'It will delete one  pet breed in the response',
  })
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
