import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StandardResponseModule } from 'nest-standard-response';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PetModule } from './pet/pet.module';
import { AuthModule } from './auth/auth.module';
import { PetTypeModule } from './pet_type/pet_type.module';
import { PetBreedModule } from './pet_breed/pet_breed.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    }),
    StandardResponseModule.forRoot({}),
    DatabaseModule,
    UserModule,
    RoleModule,
    PetModule,
    AuthModule,
    PetTypeModule,
    PetBreedModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
