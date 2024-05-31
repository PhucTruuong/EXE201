import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationRepository } from './notification.repository';
import { NotificationProviders } from './notification.providers';
import { NotificationGateWay } from './notification.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    JwtService,
    NotificationRepository,
    ...NotificationProviders,
    NotificationGateWay,
  ],
  imports: [DatabaseModule,AuthModule],
  exports: [],
})
export class NotificationModule {}
