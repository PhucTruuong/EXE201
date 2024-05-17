import { UserRepository } from './user.repository';
import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    public async findAllUser(): Promise<object[] | InternalServerErrorException | HttpException> {
        return this.userRepository.findAllUser();
    }

    public async findUserById(id: number): Promise<object> {
        return this.userRepository.findUserById(id);
    }

    public async createUser(user: object): Promise<object> {
        return this.userRepository.createUser(user);
    }

    public async updateUser(user: any): Promise<boolean | InternalServerErrorException> {
        return this.userRepository.updateUser(user);
    }

    public async disableUserAccount(id: number): Promise<boolean | InternalServerErrorException | NotFoundException> {
        return this.userRepository.disableUserAccount(id);
    };
}
