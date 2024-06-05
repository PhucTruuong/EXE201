import {
    InternalServerErrorException,
    HttpException,
    NotFoundException,
    ConflictException,
    NotImplementedException
} from '@nestjs/common';
import { UserPaginationDto, UserModifiedDto } from './user.dto';

export interface IUser {
    findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number,
    } | InternalServerErrorException | HttpException>;
    findUserById(id: string): Promise<object | InternalServerErrorException | NotFoundException>;
    createUser(user: any): Promise<object | InternalServerErrorException | ConflictException>;
    updateUser(user: UserModifiedDto): Promise<string | InternalServerErrorException>;
    disableUserAccount(id: string): Promise<
        string |
        InternalServerErrorException |
        NotFoundException |
        NotImplementedException
    >;
};