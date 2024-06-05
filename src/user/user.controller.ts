import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    Patch,
    ValidationPipe,
    UsePipes,
    UseGuards,
    Query
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiQuery
} from '@nestjs/swagger';
import {
    InternalServerErrorException,
    HttpException,
    NotFoundException,
    NotImplementedException,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';

@ApiTags('Accounts')
@Controller('api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('/')
    @UseGuards(JwtAdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiOperation({ summary: 'Admin will list all  users in the response' })
    @ApiResponse({
        status: 200,
        description: '[ADMIN] It will list all  users in the response',
    })
    @StandardResponse({
        isPaginated: true,
    })
    async findAllUser(
        @Query() pagination: UserPaginationDto,
        @StandardParam() standardParam: StandardParams
    ) {
        const allUsers = await this.userService.findAllUser(pagination);

        if (allUsers instanceof InternalServerErrorException ||
            allUsers instanceof HttpException
        ) {
            return allUsers as HttpException | InternalServerErrorException;
        } else {
            const { data, totalCount } = allUsers;
            standardParam.setPaginationInfo({ 
                count: totalCount,
                limit: data.length,
            });
            return data;
        };
    };

    @Get(':id')
    @UseGuards(JwtAdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] detail users' })
    @ApiResponse({
        status: 200,
        description: '[ADMIN] It will detail users in the response',
    })
    async findUserById(@Param('id') user_id: string) {
        const user = await this.userService.findUserById(user_id);
        if (user instanceof InternalServerErrorException
            || user instanceof NotFoundException
        ) {
            return user as InternalServerErrorException || NotFoundException;
        } else {
            return user;
        }
    };

    @Post('/')
    @UseGuards(JwtAdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] create a new user ' })
    @ApiResponse({
        status: 201,
        description: '[ADMIN] It will create a new user in the response',
    })
    @ApiBody({
        type: UserCreateDto
    })
    async createUser(@Body() user: UserCreateDto) {
        return await this.userService.createUser(user);
    };

    @UsePipes(new ValidationPipe({
        transform: true,
        skipMissingProperties: true
    }))
    @Patch()
    @UseGuards(JwtAdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] Update users  ' })
    @ApiResponse({
        status: 201,
        description: '[ADMIN] It will update all in the response',
    })
    @ApiBody({
        type: UserModifiedDto
    })
    async updateUser(@Body() user: UserModifiedDto) {
        const userUpdated = await this.userService.updateUser(user);

        if (userUpdated instanceof InternalServerErrorException ||
            NotFoundException
        ) {
            return userUpdated as InternalServerErrorException | NotFoundException;
        };

        return new HttpException(userUpdated, HttpStatus.OK);
    };

    @Patch('/disable/:id')
    @UseGuards(JwtAdminGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: ' [ADMIN] disable accounts' })
    @ApiResponse({
        status: 200,
        description: '[ADMIN] It will  disable account iun  all in the response',
    })
    async disableUserAccount(@Param('id') id: string) {
        const disableAccount = await this.userService.disableUserAccount(id);
   
        if (disableAccount instanceof InternalServerErrorException ||
            NotFoundException || NotImplementedException
        ) {
            return disableAccount as InternalServerErrorException | NotFoundException | NotImplementedException;
        };

        return new HttpException(disableAccount, HttpStatus.OK);
    };
}
