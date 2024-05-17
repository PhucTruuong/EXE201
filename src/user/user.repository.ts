import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Inject,
    NotFoundException
} from '@nestjs/common';
import { User } from 'src/database/dabaseModels/user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UserRepository implements IUser {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userModel: typeof User,
    ) { };

    public async findAllUser(): Promise<object[] | InternalServerErrorException | HttpException> {
        try {
            const allUsers = await this.userModel.findAll({
                attributes: [
                    'user_id',
                    'full_name',
                    'email',
                    'phone_number'
                ],
                limit: 10,
            });

            //console.log("all user: ", formattedUsers);

            if (!allUsers) {
                return new HttpException('No user found!', HttpStatus.NOT_FOUND);
            } else {
                return allUsers;
            }
        } catch (error) {
            throw new InternalServerErrorException("Error fetching users", error)
        };
    };

    public async findUserById(id: number): Promise<object | InternalServerErrorException> {
        try {
            const user = await this.userModel.findOne({
                where: {
                    user_id: id
                },
                attributes: [
                    'user_id',
                    'full_name',
                    'email',
                    'phone_number'
                ]
            });

            if (!user) {
                throw new NotFoundException('User not found!');
            } else {
                return user;
            }
        } catch {
            throw new InternalServerErrorException("Error fetching user");
        }
    };

    public async createUser(user: any): Promise<any | InternalServerErrorException> {
        try {
            const newUser = await this.userModel.create(user);

            if (!newUser) {
                throw new InternalServerErrorException('Error creating user');
            } else {
                return newUser;
            }
        } catch {
            throw new InternalServerErrorException("Error creating user");
        }
    };

    public async updateUser(user: any): Promise<boolean | InternalServerErrorException> {
        try {
            const updatedUser = await this.userModel.update(user, {
                where: {
                    user_id: user.user_id
                }
            });

            if (!updatedUser) {
                throw new InternalServerErrorException('Error updating user');
            } else {
                return true;
            }
        } catch {
            throw new InternalServerErrorException("Error updating user");
        }
    };

    public async disableUserAccount(id: number): Promise<boolean | InternalServerErrorException | NotFoundException> {
        try {
            const disabledUser = await this.userModel.update({
                is_active: false
            }, {
                where: {
                    user_id: id
                }
            });

            if (!disabledUser) {
                throw new NotFoundException('User not found!');
            } else {
                return true;
            }
        } catch {
            throw new InternalServerErrorException("Error disabling user account");
        }
    }
}