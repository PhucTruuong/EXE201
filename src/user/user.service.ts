import { UserRepository } from './user.repository';
import {
    //HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    NotImplementedException
} from '@nestjs/common';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';
import { RequestWithUser } from 'src/interface/request-interface';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    public async findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number,
    } | InternalServerErrorException | NotFoundException | NotFoundException> {
        return this.userRepository.findAllUser(pagination);
    }

    public async findUserById(id: string): Promise<object | NotFoundException | InternalServerErrorException> {
        return this.userRepository.findUserById(id);
    }

    public async createUser(user: UserCreateDto): Promise<object | InternalServerErrorException | ConflictException> {
        return this.userRepository.createUser(user);
    }

    public async updateUser(user: UserModifiedDto): Promise<
        string |
        InternalServerErrorException |
        NotFoundException
    > {
        return this.userRepository.updateUser(user);
    }

    public async disableUserAccount(id: string): Promise<
        string |
        InternalServerErrorException |
        NotFoundException |
        NotImplementedException
    > {
        return this.userRepository.disableUserAccount(id);
    };
    public async getProfile(req:RequestWithUser){
        return this.userRepository.getProfile(req);
    }
}
