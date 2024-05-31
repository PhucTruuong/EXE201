import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentProviders } from './payment.provider';
import { PaymentRepository } from './payment.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ...PaymentProviders, PaymentRepository],
  imports: [DatabaseModule],
})
export class PaymentModule {}
