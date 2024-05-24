import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './booking.repository';
import { BookingProviders } from './booking.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AppointmentProviders } from 'src/appointment/appointment.providers';
import { UserProviders } from 'src/user/user.provider';

@Module({
  controllers: [BookingController],
  providers: [BookingService,
    BookingRepository
    , ...BookingProviders,
    ...AppointmentProviders,
    ...UserProviders
  ],
  imports: [DatabaseModule
  ]
})
export class BookingModule { }
