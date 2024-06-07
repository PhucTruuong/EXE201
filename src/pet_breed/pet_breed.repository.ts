import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { IPetBreed } from './pet_breed.interface';
import { PetBreed } from 'src/database/dabaseModels/pet_breed.entity';
import { CreatePetBreedDto } from './dto/create-pet_breed.dto';
import { v4 as uuidv4 } from 'uuid';
import { PetBreedPagination } from './dto/pagination-pet-breed.dto';
import { UpdatePetBreedDto } from './dto/update-pet_breed.dto';
import { PetType } from 'src/database/dabaseModels/pet_type.entity';

@Injectable()
export class PetBreedRepository implements IPetBreed {
  constructor(
    @Inject('PET_BREED_REPOSITORY')
    private readonly petBreedModel: typeof PetBreed,
    @Inject('PET_TYPE_REPOSITORY')
    private readonly petTypeModel: typeof PetType,
  ) { }
  async createPetBreed(
    createPetType: CreatePetBreedDto,
  ): Promise<
    object | InternalServerErrorException | HttpException | ConflictException
  > {
    try {
      const existingPetBreed = await this.petBreedModel.findOne({
        where: {
          breed_name: createPetType.breed_name,
        },
      });
      if (existingPetBreed) {
        throw new ConflictException('Pet Breeds already exists');
      }
      const existingPetType = await this.petTypeModel.findOne({
        where: { id: createPetType.pet_type_id },
      });
      if (!existingPetType) {
        throw new ConflictException('Pet Type is wrong or not found');
      }
      const newPetBreed = this.petBreedModel.create({
        id: uuidv4(),
        breed_name: createPetType.breed_name,
        breed_description: createPetType.breed_description,
        pet_type_id: createPetType.pet_type_id,
        createAt: new Date(),
        updateAt: new Date(),
      });
      return newPetBreed;
    } catch (error) {
      console.log('error from create pet breeds', error);
      throw new InternalServerErrorException('Error create pet breeds', error);
    }
  }
  async findAllPetBreed(
    pagination: PetBreedPagination,
  ): Promise<
    | InternalServerErrorException
    | HttpException
    | { data: object[]; totalCount: number }
  > {
    try {
      if (pagination.limit === undefined && pagination.page === undefined) {
        const allPetBreed = await this.petBreedModel.findAll({
          attributes: [
            'id',
            'breed_name',
            'breed_description',
            'pet_type_id',
            'status',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: PetType,
              attributes: ['id', 'id', 'type_name', 'type_description'],
            },
          ],
        });

        if (!allPetBreed) {
          return new HttpException('No Pet Type found!', HttpStatus.NOT_FOUND);
        } else {
          return {
            data: allPetBreed,
            totalCount: 1,
          };
        };
      };

      if (
        (pagination.limit === undefined && pagination.page) ||
        (pagination.limit && pagination.page === undefined)
      ) {
        return new BadRequestException('Please provide page and limit!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;
      const findOptions: any = {
        attributes: [
          'id',
          'breed_name',
          'breed_description',
          'pet_type_id',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: PetType,
            attributes: ['id', 'id', 'type_name', 'type_description'],
          },
        ],
      };

      const { count, rows: allPetBreed } = await this.petBreedModel.findAndCountAll(findOptions);

      const numberOfPage = Math.ceil(count / pagination.limit);

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }
      if (!allPetBreed || count === 0) {
        return new HttpException('No Pet Type found!', HttpStatus.NOT_FOUND);
      } else {
        return {
          data: allPetBreed,
          totalCount: numberOfPage,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error fetching pet  breed',
        error,
      );
    }
  }

  async findOnePetBreed(
    id: string,
  ): Promise<object | InternalServerErrorException | HttpException> {
    try {
      const petBreed = await this.petBreedModel.findOne({
        where: { id: id },
      });
      if (!petBreed) {
        throw new NotFoundException('pet breed not found');
      }
      return petBreed;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error find one  pet breed',
        error,
      );
    }
  }
  async updatePetBreed(
    id: string,
    updatePetType: UpdatePetBreedDto,
  ): Promise<object | InternalServerErrorException | HttpException> {
    try {
      const petBreed = await this.petBreedModel.findOne({
        where: { id: id },
      });
      if (!petBreed) {
        throw new NotFoundException('pet breed not found');
      }
      const PetBreedUpdated = await this.petBreedModel.update(
        {
          breed_name: updatePetType.breed_name,
          breed_description: updatePetType.breed_description,
          pet_type_id: updatePetType.pet_type_id,
        },
        {
          where: { id: id },
        },
      );
      return PetBreedUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error update one pet type',
        error,
      );
    }
  }
  async deletePetBreed(
    id: string,
  ): Promise<object | InternalServerErrorException | HttpException> {
    try {
      const petType = await this.petBreedModel.findOne({
        where: { id: id },
      });
      if (!petType) {
        throw new NotFoundException('pet breed not found');
      }
      await this.petBreedModel.destroy({
        where: { id: id },
      });
      return {
        message: 'pet breed deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error delete one pet breed',
        error,
      );
    }
  }
  async getPetBreedByPetType(
    id: string,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    try {
      const petBreeds = await this.petBreedModel.findAll({
        where: {
          pet_type_id: id,
        },
      });
      if (!petBreeds) {
        return new NotFoundException('Do not find pet breed!');
      }
      return petBreeds;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error find pet breed', error);
    }
  }
}
