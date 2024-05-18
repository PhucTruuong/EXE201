import {
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { RoleDto } from './role.dto';

export interface IRole {
    findAllRoles(): Promise<object[] | InternalServerErrorException | NotFoundException>;
    findRoleById(role_id: number): Promise<object | InternalServerErrorException | NotFoundException>;
    createRole(role_name: string): Promise<any | InternalServerErrorException>;
    updateRole(role: RoleDto): Promise<boolean | InternalServerErrorException>;
    disableRole(role_id: string): Promise<boolean | InternalServerErrorException | NotFoundException>;
    findRoleByName(role_name: string): Promise<object | InternalServerErrorException | NotFoundException>;
}