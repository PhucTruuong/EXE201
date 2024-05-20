import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PetProviders } from './pet.providers';
import { PetTypeProviders } from 'src/pet_type/pet_type.providers';
import { PetBreedProviders } from 'src/pet_breed/pet_breed.providers';
import { UserProviders } from 'src/user/user.provider';
import { PetRepository } from './pet.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PetController],
  providers: [PetService,
    PetRepository,
    ...PetProviders,
    ...PetTypeProviders,
    ...PetBreedProviders,
    ...UserProviders,
  ],
})
export class PetModule { }
