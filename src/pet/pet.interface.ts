import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PetPagination } from "./dto/pet-pagination.dto";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { RequestWithUser } from "src/interface/request-interface";

export interface IPet {
    findAllPet(pagination: PetPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException>;
    createPet(createPetDto: CreatePetDto & { image: Express.Multer.File }, req: RequestWithUser): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOnePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    updatePet(id: string, updatePetDto: UpdatePetDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>
    deletePet(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException>;
    checkExist(id: string): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException>;
    findAllPetByUser(req: RequestWithUser, pagination: PetPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException>
}