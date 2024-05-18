import { RoleRepository } from './role.repository';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { RoleDto, CreateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) { };

    public async findAllRole(): Promise<object[] | InternalServerErrorException | NotFoundException> {
        return this.roleRepository.findAllRoles();
    };

    public async findRoleById(role_id: number): Promise<object | InternalServerErrorException | NotFoundException> {
        return this.roleRepository.findRoleById(role_id);
    };

    public async createRole(role_name: CreateRoleDto): Promise<object | InternalServerErrorException | ConflictException> {
        const rlename = role_name.role_name;
        return await this.roleRepository.createRole(rlename);
    };

    public async updateRole(role: RoleDto): Promise<boolean | InternalServerErrorException | NotFoundException> {
        return await this.roleRepository.updateRole(role);
    };

    public async disableRole(role_id: string): Promise<boolean | InternalServerErrorException | NotFoundException> {
        return await this.roleRepository.disableRole(role_id);
    }
}
