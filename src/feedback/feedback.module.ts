import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FeedbackProviders } from './feedback.provider';
import { feedbackRepository } from './feedback.repository';
import { ServiceProviders } from 'src/service/service.providers';
import { UserProviders } from 'src/user/user.provider';
import { ServiceRepository } from 'src/service/service.repository';
import { UserRepository } from 'src/user/user.repository';
import { LocationProviders } from 'src/location/location.provider';
import { LocationRepository } from 'src/location/location.repository';
import { BrandRepository } from 'src/brand/brand.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { BrandProviders } from 'src/brand/brand.provider';
import { CategoryProviders } from 'src/category/category.providers';
import { bcryptModule } from 'src/utils/bcryptModule';
import { RoleProviders } from 'src/role/role.provider';
import { RoleRepository } from 'src/role/role.repository';
import { CityProviders } from 'src/city/city.provider';
import { CityRepository } from 'src/city/city.repository';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationGateWay } from 'src/notification/notification.gateway';
import { NotificationProviders } from 'src/notification/notification.providers';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationRepository } from 'src/notification/notification.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService,
    NotificationService,
    bcryptModule,
    NotificationGateWay,
    ...NotificationProviders,
    ...FeedbackProviders,
    ...ServiceProviders,
    ...UserProviders,
    ...LocationProviders,
    ...BrandProviders,
    ...CategoryProviders,
    ...RoleProviders,
    ...CityProviders,
    JwtService,
    NotificationRepository,
    CityRepository,
    RoleRepository,
    feedbackRepository,
    ServiceRepository,
    UserRepository,
    LocationRepository,
    BrandRepository,
    CategoryRepository,
    CloudinaryService,
    CloudinaryProvider
  ],
  imports:[DatabaseModule]
})
export class FeedbackModule {}
