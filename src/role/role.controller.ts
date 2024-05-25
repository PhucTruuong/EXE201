import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    UseGuards,
    // Patch,
    // ValidationPipe,
    // UsePipes
} from '@nestjs/common';
import { 
    ApiBearerAuth,
    ApiBody, 
    ApiOperation, 
    ApiResponse, 
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
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';

@ApiTags('Role')
@UseGuards(JwtAdminGuard)
@Controller('api/v1/role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { };

    @Get('')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] list all roles' })
    @ApiResponse({
      status: 201,
      description: '[ADMIN] It will list all in the response',
    })
    async getAllRole() {
        const allRoles = await this.roleService.findAllRole()
        if (allRoles instanceof InternalServerErrorException ||
            allRoles instanceof NotFoundException) {
            return allRoles as InternalServerErrorException | NotFoundException
        } else {
            return allRoles;
        }
    }

    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] detail  role' })
    @ApiResponse({
      status: 201,
      description: '[ADMIN] It will detail role in the response',
    })
    async getARole(@Param('id') role_id: number) {
        const role = await this.roleService.findRoleById(role_id);
        if (role instanceof InternalServerErrorException
            || role instanceof NotFoundException) {
            return role as InternalServerErrorException | NotFoundException;
        } else {
            return role;
        }
    }

    @Post('/')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] create a new roles' })
    @ApiResponse({
      status: 201,
      description: '[ADMIN] It will  create in the response',
    })
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
