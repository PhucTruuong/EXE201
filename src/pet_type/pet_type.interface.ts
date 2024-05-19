import { ConflictException, HttpException, InternalServerErrorException } from "@nestjs/common";
import { PetTypePagination } from "./dto/pet-type-pagination.dto";
import { CreatePetTypeDto } from "./dto/create-pet_type.dto";
import { UpdatePetTypeDto } from "./dto/update-pet_type.dto";

export interface IPetType {
    findAllPetType(pagination: PetTypePagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    createPetType(createPetType: CreatePetTypeDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException
    >
    findOnePetType(id: string):Promise<object | InternalServerErrorException | HttpException>
    updatePetType(id: string,updatePetType: UpdatePetTypeDto): Promise<object | InternalServerErrorException | HttpException>
    deletePetType(id: string): Promise<object | InternalServerErrorException | HttpException>
}