import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryRepository } from './category.repository';
import { CategoryProviders } from './category.providers';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService,
    CategoryRepository,
    ...CategoryProviders,
    CloudinaryProvider,
    CloudinaryService


  ],
})
export class CategoryModule { }
