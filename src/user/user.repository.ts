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
import { v4 as uuidv4 } from 'uuid';
import { bcryptModule } from 'src/utils/bcryptModule';
import { Role } from 'src/database/dabaseModels/role.entity';

@Injectable()
export class UserRepository implements IUser {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userModel: typeof User,
        private readonly bcryptUtils: bcryptModule,
        @Inject('ROLE_REPOSITORY')
        private readonly roleModels: typeof Role
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
        };
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

            console.log(existingUser);

            if (existingUser !== null) {
                throw new ConflictException(
                    `The user has the email ${user.email} or the phone number ${user.phone_number} had already exists!`
                );
            } else {
                const role = await this.roleModels.findOne({
                    where: {
                        role_name: user.role_name
                    }
                });

                // console.log("Role: ", role.dataValues);
                // console.log("Role Id: ", role.role_id)

                if (!role) {
                    throw new NotFoundException(`The role ${user.role_name} does not exist!`);
                }

                //console.log("skjdnfkjs");
                const pwd = await this.bcryptUtils.getHash(user.password);
                //console.log("Password: ", pwd);

                const newUser = await this.userModel.create({
                    user_id: uuidv4(),
                    full_name: user.full_name,
                    email: user.email,
                    role_id: role.role_id,
                    phone_number: user.phone_number,
                    password_hashed: pwd,
                    account_status: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                //console.log("New user: ", newUser);

                return newUser;
            }
        } catch (error) {
            throw new InternalServerErrorException("Error while creating user!", error);
        };
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
        };
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
        };
    };
};