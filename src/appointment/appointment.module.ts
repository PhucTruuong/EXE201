import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AppointmentProviders } from './appointment.providers';
import { AppointmentRepository } from './appointment.repository';
import { PetProviders } from 'src/pet/pet.providers';
import { ServiceProviders } from 'src/service/service.providers';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService,
    ...AppointmentProviders,
    ...PetProviders,
    ...ServiceProviders,
    AppointmentRepository
  ],
  imports: [DatabaseModule]
})
export class AppointmentModule { }
