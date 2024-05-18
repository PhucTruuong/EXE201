import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    // Patch,
    // ValidationPipe,
    // UsePipes
} from '@nestjs/common';
import { 
    ApiBody, 
    ApiTags 
} from '@nestjs/swagger';
import {
    InternalServerErrorException,
    //HttpException,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { 
    //RoleDto, 
    CreateRoleDto 
} from './role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { };

    @Get('/all-roles')
    async getAllRole() {
        const allRoles = await this.roleService.findAllRole()
        if (allRoles instanceof InternalServerErrorException ||
            allRoles instanceof NotFoundException) {
            return allRoles as InternalServerErrorException | NotFoundException
        } else {
            return allRoles;
        }
    }

    @Get('/:id')
    async getARole(@Param('id') role_id: number) {
        const role = await this.roleService.findRoleById(role_id);
        if (role instanceof InternalServerErrorException
            || role instanceof NotFoundException) {
            return role as InternalServerErrorException | NotFoundException;
        } else {
            return role;
        }
    }

    @Post('/new-role')
    @ApiBody({
        type: CreateRoleDto
    })
    async createRole(@Body() role_name: CreateRoleDto) {
        console.log(role_name);
        const newRole = await this.roleService.createRole(role_name);

        if(newRole instanceof InternalServerErrorException || ConflictException){
            return newRole as InternalServerErrorException | ConflictException;
        } else {
            return { newRole, message: 'Create new role successfully!' };
        };
    };


}
