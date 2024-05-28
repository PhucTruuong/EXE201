import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, HttpException, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { PetTypeService } from './pet_type.service';
import { CreatePetTypeDto } from './dto/create-pet_type.dto';
import { UpdatePetTypeDto } from './dto/update-pet_type.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetTypePagination } from './dto/pet-type-pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { LoggerService } from 'src/my-logger/service/logger.service';

@ApiTags('Pet Types')
@Controller('api/v1/pet-type')
export class PetTypeController {
  constructor(private readonly petTypeService: PetTypeService) { };
  private readonly logger = new LoggerService(PetTypeController.name);

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' Create a new pet type' })
  @ApiResponse({
    status: 201,
    description: ' It will create a new pet type in the response',
  })
  @ApiBody({
    type: CreatePetTypeDto
  })
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

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' List all  pet types' })
  @ApiResponse({
    status: 200,
    description: ' It will list all  pet type in the response',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '  detail pet type' })
  @ApiResponse({
    status: 200,
    description: ' It will return detail   pet type in the response',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update   pet type' })
  @ApiResponse({
    status: 200,
    description: ' It will update  pet type in the response',
  })
  @ApiBody({
    type:UpdatePetTypeDto
  })
  async update(@Param('id') id: string, @Body() updatePetTypeDto: UpdatePetTypeDto) {
    this.logger.log(`Request update pet type`, PetTypeController.name)
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' delete  pet types' })
  @ApiResponse({
    status: 200,
    description: ' It will delete pet type in the response',
  })
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
