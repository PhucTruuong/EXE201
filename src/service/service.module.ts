import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceProviders } from './service.providers';
import { ServiceRepository } from './service.repository';
import { LocationProviders } from 'src/location/location.provider';
import { BrandProviders } from 'src/brand/brand.provider';
import { CategoryProviders } from 'src/category/category.providers';
import { LocationRepository } from 'src/location/location.repository';
import { BrandRepository } from 'src/brand/brand.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { CityProviders } from 'src/city/city.provider';
import { CityRepository } from 'src/city/city.repository';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService,
    ...ServiceProviders,
    ...LocationProviders,
    ...BrandProviders,
    ...CategoryProviders,
    ...CityProviders,

    ServiceRepository,
    CityRepository,
    LocationRepository,
    BrandRepository,
    CategoryRepository,
    CloudinaryProvider,
    CloudinaryService,

  ],
  imports: [DatabaseModule]
})
export class ServiceModule { }
