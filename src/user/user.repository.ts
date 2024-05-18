import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Inject,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { User } from 'src/database/dabaseModels/user.entity';
import { IUser } from './user.interface';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { bcryptModule } from 'src/utils/bcryptModule';

@Injectable()
export class UserRepository implements IUser {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userModel: typeof User,
        private readonly bcryptUtils: bcryptModule
    ) { 
    };

    public async findAllUser(pagination: UserPaginationDto): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | HttpException> {
        try {
            const { count, rows: allUsers } = await this.userModel.findAndCountAll({
                attributes: [
                    'user_id',
                    'full_name',
                    'email',
                    'phone_number'
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });

            console.log(allUsers);

            if (!allUsers || count === 0) {
                return new HttpException('No user found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allUsers,
                    totalCount: count
                };
            };
        } catch (error) {
            throw new InternalServerErrorException("Error fetching users", error)
        };
    };

    public async findUserById(id: number): Promise<object | InternalServerErrorException | NotFoundException> {
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

    public async createUser(user: UserCreateDto): Promise<object | InternalServerErrorException | ConflictException> {
        try {
            const existingUser = await this.userModel.findOne({
                where: {
                    [Op.or]: [
                        { email: user.email },
                        { phone_number: user.phone_number }
                    ]
                }
            });

            if (!existingUser) {
                throw new ConflictException(
                    `The user has the email ${user.email} or the phone number 
                    ${user.phone_number} had already exists!`
                );
            } else {
                const pwd = await this.bcryptUtils.getHash(user.password);
                const newUser = await this.userModel.create({
                    user_id: uuid(),
                    full_name: user.full_name,
                    email: user.email,
                    phone_number: user.phone_number,
                    password_hashed: pwd,
                    account_status: true,
                });

                return newUser;
            }
        } catch {
            throw new InternalServerErrorException("Error creating user");
        }
    };

    public async updateUser(user: UserModifiedDto): Promise<boolean | InternalServerErrorException> {
        try {
            const updatedUser = await this.userModel.update(
                {
                    full_name: user?.full_name,
                    email: user?.email,
                    phone_number: user?.phone_number
                },
                {
                    where: {
                        user_id: user.user_id
                    }
                }
            );

            if (updatedUser[0] < 1) {
                throw new NotFoundException('User does not exist!');
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