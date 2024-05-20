import { ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IPetType } from "./pet_type.interface";
import { CreatePetTypeDto } from "./dto/create-pet_type.dto";
import { PetType } from "src/database/dabaseModels/pet_type.entity";
import { v4 as uuidv4 } from 'uuid';
import { PetTypePagination } from "./dto/pet-type-pagination.dto";
import { UpdatePetTypeDto } from "./dto/update-pet_type.dto";

@Injectable()
export class PetTypeRepository implements IPetType {
    constructor(
        @Inject('PET_TYPE_REPOSITORY')
        private readonly petTypeModel: typeof PetType,
    ) { }
    async createPetType(createPetType: CreatePetTypeDto): Promise<object | InternalServerErrorException | HttpException | ConflictException> {
        try {
            const existingPetType = await this.petTypeModel.findOne({
                where: {
                    type_name: createPetType.type_name
                }
            })
            if (existingPetType) {
                throw new ConflictException("Pet Type already exists");
            }
            const newPetType = this.petTypeModel.create({
                id: uuidv4(),
                type_name: createPetType.type_name,
                type_description: createPetType.type_description,
                createAt: new Date(),
                updateAt: new Date(),
            })
            return newPetType;
        } catch (error) {
            console.log("error from create pet type", error)
            throw new InternalServerErrorException("Error create pet type", error)
        };
    }
    async findAllPetType(pagination: PetTypePagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | HttpException> {
        try {
            const { count, rows: allPetType } = await this.petTypeModel.findAndCountAll({
                attributes: [
                    'id',
                    'type_name',
                    'type_description',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });
            if (!allPetType || count === 0) {
                return new HttpException('No Pet Type found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allPetType,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching pet type", error)
        };
    }
    async findOnePetType(id: string): Promise<object | InternalServerErrorException | HttpException> {
        try {
            const petType = await this.petTypeModel.findOne({
                where: { id: id }
            })
            if (!petType) {
                throw new NotFoundException("pet type not found");
            }
            return petType
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find one  pet type", error)
        };
    }
    async deletePetType(id: string): Promise<object | InternalServerErrorException | HttpException> {
        try {
            const petType = await this.petTypeModel.findOne({
                where: { id: id }
            })
            if (!petType) {
                throw new NotFoundException("pet type not found");
            }
            await this.petTypeModel.destroy({
                where: { id: id }
            })
            return {
                message: "pet type deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one pet type", error)
        };
    }
    async updatePetType(id:string ,updatePetType: UpdatePetTypeDto): Promise<object | InternalServerErrorException | HttpException> {
        try {
            const petType = await this.petTypeModel.findOne({
                where: { id:id }
            })
            if (!petType) {
                throw new NotFoundException("pet type not found");
            }
            const PetTypeUpdated = await this.petTypeModel.update(

                {
                    type_name: updatePetType.type_name,
                    type_description: updatePetType.type_description
                },
                {
                    where: { id: id }
                }
            )
            return PetTypeUpdated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update one pet type", error)
        };
    }

}