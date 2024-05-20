import { Module } from '@nestjs/common';
import { PetTypeService } from './pet_type.service';
import { PetTypeController } from './pet_type.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PetTypeRepository } from './pet_type.repository';
import { PetTypeProviders } from './pet_type.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [PetTypeController],
  providers: [PetTypeService,
    PetTypeRepository,
    ...PetTypeProviders
  ],
})
export class PetTypeModule { }
