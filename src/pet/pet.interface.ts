import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PetPagination } from "./dto/pet-pagination.dto";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";

export interface IPet {
    findAllPet(pagination: PetPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    createPet(createPetDto: CreatePetDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOnePet(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    updatePet(id: string,updatePetDto: UpdatePetDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>
    deletePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> 
}