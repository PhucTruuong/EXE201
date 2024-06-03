import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentProviders } from './payment.provider';
import { PaymentRepository } from './payment.repository';
import { DatabaseModule } from 'src/database/database.module';
import { BookingProviders } from 'src/booking/booking.providers';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ...PaymentProviders, PaymentRepository,...BookingProviders],
  imports: [DatabaseModule],
})
export class PaymentModule {}
