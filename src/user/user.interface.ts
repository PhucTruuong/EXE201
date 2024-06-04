import { 
    InternalServerErrorException,
    HttpException,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { UserPaginationDto, UserModifiedDto } from './user.dto';

export interface IUser {
    findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number,
        isPaginated: boolean
    } | InternalServerErrorException | HttpException>;
    findUserById(id: string): Promise<object | InternalServerErrorException | NotFoundException>;
    createUser(user: any): Promise<object | InternalServerErrorException | ConflictException>;
    updateUser(user: UserModifiedDto): Promise<boolean | InternalServerErrorException>;
    disableUserAccount(id: number): Promise<boolean | InternalServerErrorException | NotFoundException>;
};