import { ConflictException, HttpException, InternalServerErrorException } from "@nestjs/common";
import { PetBreedPagination } from "./dto/pagination-pet-breed.dto";
import { CreatePetBreedDto } from "./dto/create-pet_breed.dto";
import { UpdatePetBreedDto } from "./dto/update-pet_breed.dto";


export interface IPetBreed {
    findAllPetBreed(pagination: PetBreedPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    createPetBreed(createPetType: CreatePetBreedDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException
    >
    findOnePetBreed(id: string):Promise<object | InternalServerErrorException | HttpException>
    updatePetBreed(id: string,updatePetType: UpdatePetBreedDto): Promise<object | InternalServerErrorException | HttpException>
    deletePetBreed(id: string): Promise<object | InternalServerErrorException | HttpException>
}