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

@ApiTags('Accounts')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAllUser() {
        const allUsers = await this.userService.findAllUser();
        if (allUsers instanceof InternalServerErrorException || 
            allUsers instanceof HttpException
        ) {
            return allUsers as HttpException | InternalServerErrorException;
        }
        return allUsers;
    };

    @Get('/:id')
    async findUserById(@Param('id') id: number) {
        const user = await this.userService.findUserById(id);
        if (user instanceof InternalServerErrorException
            || user instanceof NotFoundException
        ) {
            return user as InternalServerErrorException || NotFoundException; 
        } else {
            return user;
        }
    };

    @Post()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                status: { type: 'string' }
            }
        }
    })
    async createUser(@Body() user: any) {
        return await this.userService.createUser(user);
    };

    @UsePipes(new ValidationPipe({ 
        transform: true,
        skipMissingProperties: true
    }))
    @Patch()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                status: { type: 'string' }
            }
        }
    })
    async updateUser(@Body() user: any) {
        return await this.userService.updateUser(user);
    };

    @Patch('/disable/:id')
    async disableUserAccount(@Param('id') id: number) {
        return await this.userService.disableUserAccount(id);
    };
}
