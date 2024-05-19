import { Module } from '@nestjs/common';
import { PetBreedService } from './pet_breed.service';
import { PetBreedController } from './pet_breed.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PetBreedProviders } from './pet_breed.providers';
import { PetBreedRepository } from './pet_breed.repository';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [PetBreedController],
  providers: [PetBreedService,
    PetBreedRepository,
    ...PetBreedProviders
  ],
})
export class PetBreedModule {}
