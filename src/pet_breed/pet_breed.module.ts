import { Module } from '@nestjs/common';
import { PetBreedService } from './pet_breed.service';
import { PetBreedController } from './pet_breed.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PetBreedProviders } from './pet_breed.providers';
import { PetBreedRepository } from './pet_breed.repository';
import { PetTypeRepository } from 'src/pet_type/pet_type.repository';
import { PetTypeProviders } from 'src/pet_type/pet_type.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [PetBreedController],
  providers: [PetBreedService,
    PetBreedRepository,
    PetTypeRepository,
    ...PetTypeProviders,
    ...PetBreedProviders
  ],
})
export class PetBreedModule {}
