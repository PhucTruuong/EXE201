import {
    Controller,
    Get,
    Param,
    Body,
    Post,
    Patch,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
    InternalServerErrorException,
    HttpException,
    NotFoundException
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserPaginationDto, UserModifiedDto, UserCreateDto } from './user.dto';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';

@ApiTags('Accounts')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/all-users')
    @StandardResponse({
        isPaginated: true,
    })
    async findAllUser(
        @Body() pagination: UserPaginationDto,
        @StandardParam() standardParam: StandardParams
    ) {
        const allUsers = await this.userService.findAllUser(pagination);

        if (allUsers instanceof InternalServerErrorException ||
            allUsers instanceof HttpException
        ) {
            return allUsers as HttpException | InternalServerErrorException;
        } else{
            const { data, totalCount } = allUsers;
            standardParam.setPaginationInfo({ count: totalCount });
            return data;
        }
    };

    @Get('/:id')
    async findUserById(@Param('id') user_id: number) {
        const user = await this.userService.findUserById(user_id);
        if (user instanceof InternalServerErrorException
            || user instanceof NotFoundException
        ) {
            return user as InternalServerErrorException || NotFoundException;
        } else {
            return user;
        }
    };

    @Post('/new-user')
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
    @ApiBody({
        type: UserModifiedDto
    })
    async updateUser(@Body() user: UserModifiedDto) {
        return await this.userService.updateUser(user);
    };

    @Patch('/disable/:id')
    async disableUserAccount(@Param('id') id: number) {
        return await this.userService.disableUserAccount(id);
    };
}
