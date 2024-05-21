import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CityProviders } from './city.provider';
import { CityRepository } from './city.repository';

@Module({
  imports : [DatabaseModule],
  controllers: [CityController],
  providers: [CityService,
    ...CityProviders,
    CityRepository
  ],
})
export class CityModule {}
