import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.provider';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        ...UserProviders
    ],
})
export class UserModule {}
