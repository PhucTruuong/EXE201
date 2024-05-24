import { v4 as uuidv4 } from 'uuid';
import { IPet } from './pet.interface';
import { ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pet } from 'src/database/dabaseModels/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetType } from 'src/database/dabaseModels/pet_type.entity';
import { PetBreed } from 'src/database/dabaseModels/pet_breed.entity';
import { PetPagination } from './dto/pet-pagination.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { RequestWithUser } from 'src/interface/request-interface';
@Injectable()
export class PetRepository implements IPet {
    constructor(
        @Inject('PET_REPOSITORY')
        private readonly petModel: typeof Pet,
        @Inject('PET_TYPE_REPOSITORY')
        private readonly petTypeModel: typeof PetType,
        @Inject('PET_BREED_REPOSITORY')
        private readonly petBreedModel: typeof PetBreed,
    ) { }
    async createPet(createPetDto: CreatePetDto, req: RequestWithUser): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {
        try {
            // check name if exits
            const existingPet = await this.petModel.findOne({
                where: {
                    pet_name: createPetDto.pet_name
                }
            })
            if (existingPet) {
                return new ConflictException("Pet  already exists , choose other name");
            }
            // check pet type
            const existingPetType = await this.petTypeModel.findOne({
                where: { id: createPetDto.pet_type_id }
            })
            if (!existingPetType) {
                return new NotFoundException("Pet Type not found");
            }
            // check pet breed
            const existingPetBreed = await this.petBreedModel.findOne({
                where: { id: createPetDto.pet_breed_id }
            })
            if (!existingPetBreed) {
                return new NotFoundException("Pet  Breed not found");
            }
            const newPet = this.petModel.create({
                id: uuidv4(),
                pet_name: createPetDto.pet_name,
                height: createPetDto.height,
                weight: createPetDto.weight,
                pet_dob: createPetDto.pet_dob,
                pet_type_id: createPetDto.pet_type_id,
                user_id: req.user.userId,
                pet_breed_id: createPetDto.pet_breed_id,
                createAt: new Date(),
                updateAt: new Date(),
            })
            return newPet;
        } catch (error) {
            console.log("error from create pet type", error)
            throw new InternalServerErrorException("Error create pet`", error)
        };
    }
    async findAllPet(pagination: PetPagination): Promise<InternalServerErrorException | HttpException | { data: object[]; totalCount: number; }> {
        try {
            const { count, rows: allPet } = await this.petModel.findAndCountAll({
                attributes: [
                    'id',
                    'pet_name',
                    'pet_DOB',
                    'height',
                    'weight',
                    'status',
                    'user_id',
                    'pet_type_id',
                    'pet_breed_id',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });
            if (!allPet || count === 0) {
                return new HttpException('No Pet  found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allPet,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching pet ", error)
        };
    }
    async findOnePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const pet = await this.petModel.findOne({
                where: { id: id }
            })
            if (!pet) {
                return new NotFoundException("pet  not found");
            }
            return pet
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find one  pet ", error)
        };
    }
    async updatePet(id: string, updatePetDto: UpdatePetDto): Promise<object | NotFoundException | InternalServerErrorException | HttpException> {
        try {
            const pet = await this.petModel.findOne({
                where: { id: id }
            })
            if (!pet) {
                return new NotFoundException("pet  not found");
            }
            const PetUpdated = await this.petModel.update(

                {
                    pet_name: updatePetDto.pet_name,
                    height: updatePetDto.height,
                    weight: updatePetDto.weight,
                    pet_dob: updatePetDto.pet_dob,
                    pet_type_id: updatePetDto.pet_type_id,
                    pet_breed_id: updatePetDto.pet_breed_id,
                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            )
            return PetUpdated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update one pet ", error)
        };
    }
    async deletePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const pet = await this.petModel.findOne({
                where: { id: id }
            })
            if (!pet) {
                return new NotFoundException("pet  not found");
            }
            await this.petModel.destroy({
                where: { id: id }
            })
            return {
                message: "pet  deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one pet ", error)
        };
    }
    async checkExist(id: string): Promise<object | InternalServerErrorException | NotFoundException> {
        try {
            const exist = await this.petModel.findOne({
                where: { id: id }
            })
            if (!exist) {
                return new NotFoundException()
            }
            return exist;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one pet ", error)
        };
    }

    async findAllPetByUser(req: RequestWithUser, pagination: PetPagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | NotFoundException> {
        try {
            console.log("user Reuest" , req.user)
            if (!req.user || !req.user.userId) {
            return  new NotFoundException('User ID not found in request');
            }
            const { count, rows: allPet } = await this.petModel.findAndCountAll({
                where: {
                    user_id: req.user.userId
                },
                attributes: [
                    'id',
                    'pet_name',
                    'pet_DOB',
                    'height',
                    'weight',
                    'status',
                    'user_id',
                    'pet_type_id',
                    'pet_breed_id',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });
            if (!allPet || count === 0) {
                return new HttpException('No Pet  found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allPet,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching pet ", error)
        };
    }
}