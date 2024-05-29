import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
   ) {}
  public async create(
    createINotificationDto: CreateNotificationDto,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    return this.notificationRepository.create(createINotificationDto);
  }
  public async find(
    userId: string,
  ): Promise<object | InternalServerErrorException> {
    return this.notificationRepository.find(userId);
  }
}
