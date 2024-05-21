import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BrandRepository } from './brand.repository';
import { BrandProviders } from './brand.provider';

@Module({
  controllers: [BrandController],
  providers: [BrandService,
    BrandRepository,
    ...BrandProviders
  ],
  imports: [DatabaseModule]
})
export class BrandModule { }
