import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './booking.repository';
import { BookingProviders } from './booking.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AppointmentProviders } from 'src/appointment/appointment.providers';
import { UserProviders } from 'src/user/user.provider';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentRepository } from 'src/payment/payment.repository';
import { ServiceProviders } from 'src/service/service.providers';
import { PetProviders } from 'src/pet/pet.providers';

@Module({
  controllers: [BookingController],
  providers: [BookingService,
    PaymentService,
    PaymentRepository,
    BookingRepository
    , ...BookingProviders,
    ...AppointmentProviders,
    ...UserProviders,
    ...ServiceProviders,
    ...PetProviders
  ],
  imports: [
    DatabaseModule,
    PaymentModule
  ]
})
export class BookingModule { }
