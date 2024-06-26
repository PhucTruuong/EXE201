import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StandardResponseModule } from 'nest-standard-response';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PetModule } from './pet/pet.module';
import { AuthModule } from './auth/auth.module';
import { PetTypeModule } from './pet_type/pet_type.module';
import { PetBreedModule } from './pet_breed/pet_breed.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { CityModule } from './city/city.module';
import { LocationModule } from './location/location.module';
import { ServiceModule } from './service/service.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseModule } from 'nestjs-firebase';
import { AppointmentModule } from './appointment/appointment.module';
import { BookingModule } from './booking/booking.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GatewayModule } from './gateways/gateway.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { NotificationModule } from './notification/notification.module';
// import * as path from 'path';
// import * as servicePath from "../petcare-6a561-firebase-adminsdk-1ctgv-f41da1d8c8.json"
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 2000,
        limit: 5,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 10,
      }
    ]),
    FirebaseModule,
    // FirebaseModule.forRoot({
    //   googleApplicationCredential: path.resolve(__dirname, '../petcare-6a561-firebase-adminsdk-1ctgv-f41da1d8c8.json'),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
    }),
    StandardResponseModule.forRoot({}),
    DatabaseModule,
    UserModule,
    RoleModule,
    PetModule,
    AuthModule,
    PetTypeModule,
    PetBreedModule,
    CategoryModule,
    BrandModule,
    CityModule,
    LocationModule,
    ServiceModule,
    FeedbackModule,
    AppointmentModule,
    BookingModule,
    CloudinaryModule,
    GatewayModule,
    PaymentModule,
    NotificationModule,
    MyLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
