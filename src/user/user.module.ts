import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { bcryptModule } from 'src/utils/bcryptModule';
import { RoleProviders } from 'src/role/role.provider';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        bcryptModule,
        ...RoleProviders,
        ...UserProviders
    ],
})
export class UserModule {
    
}
