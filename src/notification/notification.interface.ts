import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

export interface INotification {
  create(
    createINotificationDto: CreateNotificationDto,
  ): Promise<object | InternalServerErrorException | NotFoundException>;
  find(userId: string): Promise<object| InternalServerErrorException>;
}
