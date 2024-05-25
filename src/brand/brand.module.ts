import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BrandRepository } from './brand.repository';
import { BrandProviders } from './brand.provider';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService,
    BrandRepository,
    ...BrandProviders,
    CloudinaryProvider,
    CloudinaryService
  ],
  imports: [DatabaseModule]
})
export class BrandModule { }
