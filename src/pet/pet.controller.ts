import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, InternalServerErrorException, ConflictException, HttpException, Query, UseGuards, Req } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { PetPagination } from './dto/pet-pagination.dto';
import { JwtCustomerGuard } from 'src/auth/guard/jwt-customer.guard';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RequestWithUser } from 'src/interface/request-interface';
@ApiTags('Pet')
@Controller('api/v1/pet')
export class PetController {
  constructor(private readonly petService: PetService) { }

  @Post()
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' [CUSTOMER]Create a new pet' })
  @ApiResponse({
    status: 201,
    description: '[CUSTOMER] It will create a new pet in the response',
  })
  @ApiBody({
    type: CreatePetDto
  })
  async create(@Body() createPetDto: CreatePetDto,
    @Req() req: RequestWithUser
  ) {
    const pet = await this.petService.createPet(createPetDto,req)
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
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] List all  pet' })
  @ApiResponse({
    status: 200,
    description: '[ADMIN] It will lits all new pet in the response',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ALL ROLE] detail about  pet' })
  @ApiResponse({
    status: 201,
    description: '[ALL ROLE] It will detail a new pet in the response',
  })
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
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: ' [CUSTOMER]  Update pet' })
  @ApiResponse({
    status: 200,
    description: '[CUSTOMER ]It will update info a pet in the response',
  })
  @ApiBody({
    type: UpdatePetDto
  })
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
  @UseGuards(JwtCustomerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[CUSTOMER]  delete a  pet' })
  @ApiResponse({
    status: 200,
    description: '[CUSTOMER] it will delete pet in the response',
  })
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
