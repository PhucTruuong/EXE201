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
  ) {};

  public async create(
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
      throw new InternalServerErrorException(error.message);
    };
  };

  public async find(userId: string): Promise<object | InternalServerErrorException> {
    try {
      const notifications = this.notificationModel.findAll({
        where: { user_id: userId },
      });
      return notifications;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async update(id: string): Promise<object | InternalServerErrorException> {
    try {
      const notification = await this.notificationModel.findOne({
        where: { id: id },
      });
      if (!notification) {
        return new NotFoundException('No notification found');
      }
      notification.read = true;
      await notification.save();
      return notification;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };
};
