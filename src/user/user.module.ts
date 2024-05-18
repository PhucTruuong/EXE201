import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { bcryptModule } from 'src/utils/bcryptModule';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        bcryptModule,
        ...UserProviders
    ],
})
export class UserModule {
    
}
