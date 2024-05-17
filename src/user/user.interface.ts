import { 
    InternalServerErrorException,
    HttpException,
    NotFoundException
} from '@nestjs/common';

export interface IUser {
    findAllUser(): Promise<object[] | InternalServerErrorException | HttpException>;
    findUserById(id: number): Promise<object | InternalServerErrorException>;
    createUser(user: any): Promise<any | InternalServerErrorException>;
    updateUser(user: any): Promise<boolean | InternalServerErrorException>;
    disableUserAccount(id: number): Promise<boolean | InternalServerErrorException | NotFoundException>;
};