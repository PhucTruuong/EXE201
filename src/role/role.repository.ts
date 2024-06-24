import {
    Injectable,
    InternalServerErrorException,
    Inject,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { Role } from 'src/database/dabaseModels/role.entity';
import { IRole } from './role.interface';
import { v4 as uuidv4 } from 'uuid';
import { RoleDto } from './role.dto';

@Injectable()
export class RoleRepository implements IRole {
    constructor(
        @Inject('ROLE_REPOSITORY')
        private readonly roleModel: typeof Role,
    ) { };

    public async findAllRoles(): Promise<object[] | InternalServerErrorException | NotFoundException> {
        try {
            const allRoles = await this.roleModel.findAll({
                attributes: [
                    'role_id',
                    'role_name'
                ],
                where: {
                    role_status: true
                }
            });

            return allRoles;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        };
    };

    public async findRoleById(role_id: number): Promise<object | InternalServerErrorException | NotFoundException> {
        try {
            const role = await this.roleModel.findOne({
                where: {
                    role_id: role_id
                },
                attributes: [
                    'role_id',
                    'role_name'
                ]
            });

            if (!role) {
                throw new NotFoundException("Role not found!");
            } else {
                return role;
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            };
            throw new InternalServerErrorException(error.message);
        };
    };

    public async findRoleByName(role_name: string): Promise<
        object | InternalServerErrorException | NotFoundException
    > {
        try {
            const role = await this.roleModel.findOne({
                where: {
                    role_name: role_name
                },
                attributes: [
                    'role_id',
                    'role_name'
                ]
            });

            if (!role) {
                throw new NotFoundException("Role not found!");
            } else {
                return role;
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            };
            throw new InternalServerErrorException(error.message);
        };
    };

    public async createRole(role_name: string): Promise<any | InternalServerErrorException> {
        try {
            console.log(role_name)
            const roleExisted = await this.roleModel.findOne({
                where: { role_name: role_name }
            });

            console.log(roleExisted);

            if (roleExisted) {
                throw new ConflictException("This role is existed!")
            }

            const newRole = await this.roleModel.create({
                role_id: uuidv4(),
                role_name: role_name,
                role_status: true,
                createAt: new Date(),
                updateAt: new Date(),
            });

            return newRole;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            };
            throw new InternalServerErrorException(error)
        };
    };

    public async updateRole(role: RoleDto): Promise<boolean | InternalServerErrorException> {
        try {
            const updatedRole = await this.roleModel.update({
                role_name: role.role_name,
                updateAt: new Date(),
            }, {
                where: {
                    role_id: role.role_id
                }
            });

            if (updatedRole[0] < 1) {
                throw new NotFoundException('Role not found!');
            } else {
                return true;
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            };
            throw new InternalServerErrorException(error.message);
        };
    };

    public async disableRole(role_id: string): Promise<
        boolean | InternalServerErrorException | NotFoundException
    > {
        try {
            const disabledRole = await this.roleModel.update({
                role_status: false,
                updateAt: new Date(),
            }, {
                where: {
                    role_id: role_id,
                    role_status: true
                }
            });

            if (disabledRole[0] < 1) {
                throw new NotFoundException('Role not found!');
            } else {
                return true;
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            };
            throw new InternalServerErrorException(error.message);
        };
    };
}

