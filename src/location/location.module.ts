import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LocationProviders } from './location.provider';
import { LocationRepository } from './location.repository';
import { CityRepository } from 'src/city/city.repository';
import { CityProviders } from 'src/city/city.provider';

@Module({
  imports:[DatabaseModule],
  controllers: [LocationController],
  providers: [LocationService ,
    ...LocationProviders,
    ...CityProviders,
    LocationRepository,
    CityRepository,

  ],
})
export class LocationModule {}
