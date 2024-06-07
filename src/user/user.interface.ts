import {
    InternalServerErrorException,
    BadRequestException,
    NotFoundException,
    ConflictException,
    NotImplementedException
} from '@nestjs/common';
import { UserPaginationDto, UserModifiedDto } from './user.dto';
import { RequestWithUser } from 'src/interface/request-interface';

export interface IUser {
    findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number,
    } | InternalServerErrorException | NotFoundException | BadRequestException>;
    findUserById(id: string): Promise<object | InternalServerErrorException | NotFoundException>;
    createUser(user: any): Promise<object | InternalServerErrorException | ConflictException>;
    updateUser(user: UserModifiedDto): Promise<string | InternalServerErrorException>;
    disableUserAccount(id: string): Promise<
        string |
        InternalServerErrorException |
        NotFoundException |
        NotImplementedException
    >;
    getProfile(req:RequestWithUser) : Promise<object | InternalServerErrorException >;
};