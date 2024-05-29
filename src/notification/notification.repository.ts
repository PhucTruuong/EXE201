import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { INotification } from './notification.interface';
import { Notification } from 'src/database/dabaseModels/notification.entity';

export class NotificationRepository implements INotification {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationModel: typeof Notification,
  ) {}
  create(
    createINotificationDto: CreateNotificationDto,
  ): Promise<object | InternalServerErrorException | NotFoundException> {
    try {
      const notification = this.notificationModel.create({
        title: createINotificationDto.title,
        description: createINotificationDto.description,
        icons: 'none-icon',
        type: createINotificationDto.type,
        read: false,
        user_id: createINotificationDto.user_id,
      });
      return notification;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating notification');
    }
  }
  find(): Promise<object | InternalServerErrorException> {
    try {
      const notifications = this.notificationModel.findAll();
      return notifications;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating notification');
    }
  }
}
