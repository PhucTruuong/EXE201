import { 
    ConflictException, 
    HttpException, 
    InternalServerErrorException, 
    NotFoundException,
    BadRequestException 
} from "@nestjs/common";
import { PetPagination } from "./dto/pet-pagination.dto";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { RequestWithUser } from "src/interface/request-interface";
import { CreatePetMobileDto } from "./dto/create-pet-mobile.dto";

export interface IPet {
    findAllPet(pagination: PetPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | BadRequestException | NotFoundException>;
    createPet(createPetDto: CreatePetDto & { image: Express.Multer.File }, req: RequestWithUser): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    createPetMobile(createPetDto: CreatePetMobileDto, req: RequestWithUser): Promise<
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