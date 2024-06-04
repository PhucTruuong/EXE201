import { UserRepository } from './user.repository';
import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    public async findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number,
        isPaginated: boolean
    } | InternalServerErrorException | HttpException> {
        return this.userRepository.findAllUser(pagination);
    }

    public async findUserById(id: string): Promise<object | NotFoundException | InternalServerErrorException> {
        return this.userRepository.findUserById(id);
    }

    public async createUser(user: UserCreateDto): Promise<object | InternalServerErrorException | ConflictException> {
        return this.userRepository.createUser(user);
    }

    public async updateUser(user: UserModifiedDto): Promise<boolean | InternalServerErrorException> {
        return this.userRepository.updateUser(user);
    }

    public async disableUserAccount(id: number): Promise<boolean | InternalServerErrorException | NotFoundException> {
        return this.userRepository.disableUserAccount(id);
    };
}
