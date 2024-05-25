import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PetProviders } from './pet.providers';
import { PetTypeProviders } from 'src/pet_type/pet_type.providers';
import { PetBreedProviders } from 'src/pet_breed/pet_breed.providers';
import { UserProviders } from 'src/user/user.provider';
import { PetRepository } from './pet.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { bcryptModule } from 'src/utils/bcryptModule';
import { RoleRepository } from 'src/role/role.repository';
import { RoleProviders } from 'src/role/role.provider';
import { PetTypeRepository } from 'src/pet_type/pet_type.repository';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule,UserModule],
  controllers: [PetController],
  providers: [PetService,
    PetRepository,
    UserRepository,
    bcryptModule,
    RoleRepository,
    PetTypeRepository,
    ...RoleProviders,
    ...PetProviders,
    ...PetTypeProviders,
    ...PetBreedProviders,
    ...UserProviders,
     CloudinaryProvider,
     CloudinaryService
  ],
})
export class PetModule { }
