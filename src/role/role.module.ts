import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DatabaseModule } from 'src/database/database.module';
import { RoleProviders } from './role.provider';
import { RoleRepository } from './role.repository';

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        RoleRepository,
        ...RoleProviders,
    ],
})
export class RoleModule {}
