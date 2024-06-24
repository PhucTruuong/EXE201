import {
  Injectable,
  InternalServerErrorException,
  Inject,
  NotFoundException,
  ConflictException,
  NotImplementedException,
  BadRequestException
} from '@nestjs/common';
import { User } from 'src/database/dabaseModels/user.entity';
import { IUser } from './user.interface';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { bcryptModule } from 'src/utils/bcryptModule';
import { Role } from 'src/database/dabaseModels/role.entity';
import { RequestWithUser } from 'src/interface/request-interface';

@Injectable()
export class UserRepository implements IUser {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userModel: typeof User,
    private readonly bcryptUtils: bcryptModule,
    @Inject('ROLE_REPOSITORY')
    private readonly roleModels: typeof Role,
  ) { };

  public async findAllUser(pagination: UserPaginationDto): Promise<
    | {
      data: object[];
      totalCount: number;
    }
    | InternalServerErrorException
    | BadRequestException
    | NotFoundException
  > {
    try {
      console.log('Pagination: ', pagination);

      if (pagination.page === undefined || pagination.limit === undefined) {
        console.log('No pagination');
        const allUsers = await this.userModel.findAll({
          attributes: [
            'user_id',
            'full_name',
            'email',
            'phone_number',
            'account_status',
          ],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['role_name'],
              where: {
                role_name: {
                  [Op.notLike]: '%admin%',
                },
              },
            },
          ],
        });

        return {
          data: allUsers,
          totalCount: 1,
        };
      };

      if (
        (pagination.limit === undefined && pagination.page) ||
        (pagination.limit && pagination.page === undefined)
      ) {
        throw new BadRequestException('Please provide page and limit');
      } else {
        console.log('With pagination');
        const { count, rows: allUsers } = await this.userModel.findAndCountAll({
          attributes: [
            'user_id',
            'full_name',
            'email',
            'phone_number',
            'account_status',
          ],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['role_name'],
              where: {
                role_name: {
                  [Op.notLike]: '%admin%',
                },
              },
            },
          ],
          limit: pagination.limit,
          offset: (pagination.page - 1) * pagination.limit,
        });

        const numberOfPage = Math.ceil(count / pagination.limit);

        return {
          data: allUsers,
          totalCount: numberOfPage,
        };
      };
    } catch (error) {
      console.log('Error: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    }
  }

  public async findUserById(
    id: string,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    try {
      const user = await this.userModel.findOne({
        where: {
          user_id: id,
        },
        attributes: [
          'user_id',
          'full_name',
          'email',
          'phone_number',
          'account_status',
        ],
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      } else {
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createUser(
    user: UserCreateDto,
  ): Promise<object | InternalServerErrorException | ConflictException> {
    try {
      const promises = [
        this.userModel.findOne({
          where: {
            [Op.or]: [{ email: user.email }, { phone_number: user.phone_number }],
          },
        }),

        this.roleModels.findOne({
          where: {
            role_name: user.role_name,
          },
        })
      ];

      const [existingUser, role] = await Promise.all(promises);

      console.log(existingUser);

      if (existingUser !== null) {
        throw new ConflictException(
          `The user has the email ${user.email} or the phone number ${user.phone_number} had already exists!`,
        );
      }

      if (!role) {
        throw new NotFoundException(
          `The role ${user.role_name} does not exist!`,
        );
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

    } catch (error) {
      console.log('Error: ', error);
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateUser(
    user: UserModifiedDto,
  ): Promise<string | InternalServerErrorException | NotFoundException> {
    try {
      const updatedUser = await this.userModel.update(
        {
          full_name: user?.full_name,
          email: user?.email,
          phone_number: user?.phone_number,
          account_status: user?.account_status,
        },
        {
          where: {
            user_id: user.user_id,
          },
        },
      );

      if (updatedUser[0] < 1) {
        throw new NotFoundException('User does not exist!');
      } else {
        return `User ${user.user_id} has been updated successfully!`;
      }
    } catch (error) {
      console.log('Error: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    }
  }

  public async disableUserAccount(
    id: string,
  ): Promise<
    | string
    | InternalServerErrorException
    | NotFoundException
    | NotImplementedException
  > {
    try {
      const accountStatus = await this.userModel.findOne({
        where: {
          user_id: id,
          account_status: false,
        },
      });

      console.log(accountStatus);

      if (accountStatus) {
        throw new NotImplementedException('User account is already disabled!');
      };

      const disabledUser = await this.userModel.update(
        {
          account_status: false,
        },
        {
          where: {
            user_id: id,
          },
        },
      );

      console.log('Disabled user: ', disabledUser);

      if (disabledUser[0] < 1) {
        throw new NotFoundException('User not found!');
      } else {
        return `User account ${id} has been disabled!`;
      };
    } catch (error) {
      console.log('check if error');
      if (error instanceof NotFoundException || error instanceof NotImplementedException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    };
  };

  // public async checkIfUserExists(id: string) {
  //     const user = await this.userModel.findOne({
  //         where: { user_id: id }
  //     })
  //     if (user) {
  //         return true;
  //     } else {
  //         return false
  //     }
  // };
  public async getProfile(
    req: RequestWithUser,
  ): Promise<object | InternalServerErrorException> {
    try {
      const userId = req.user.userId;
      console.log("id", userId);

      const user = await this.userModel.findOne({
        where: { user_id: userId },
        attributes: { exclude: ['password_hashed'] }
      });

      if (!user) {
        throw new NotFoundException('User not found!');
      };

      return user;
    } catch (error) {
      console.log('Error: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    };
  };
};
