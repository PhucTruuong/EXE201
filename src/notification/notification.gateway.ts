import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Socket, Namespace,Server } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/jwt-ws.guard';
import { Notification } from 'src/database/dabaseModels/notification.entity';
export interface NotificationDto {
  userId: string;
}
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class NotificationGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateWay.name);
  constructor(private readonly notificationServices: NotificationService) {}
  @WebSocketServer() io: Namespace;
  server: Server;
  afterInit(): void {
    this.logger.log('Web socket initialization');
  }
  handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    this.io.emit('hello', ` from || ${client.id}`);
    this.logger.log(`WS Client with id ${client.id} connected`);
    this.logger.debug(`Number of connect sockets:: ${sockets.size} `);
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnect Client with id ${client.id} connected`);
    this.logger.debug(`Number of connect sockets:: ${sockets.size} `);
  }

  @SubscribeMessage('test')
  async test(socket: Socket, @MessageBody() data) {
    console.log('Hello', data);
    setTimeout(() => {
      if (this.server) {
        this.server.emit('message 2');
      }
    }, 2000);
  }
  // return data for client with notifications
  @SubscribeMessage('list-notifications')
  async handleListNotifications(
    @MessageBody() notificationDto: { userId: string },
    // client:Socket
  ): Promise<void> {
    try {
      console.log('Received userId:', notificationDto.userId);
      const notifications = await this.notificationServices.find(
        notificationDto.userId,
      );
      console.log('Retrieved notifications:', notifications);
      if (this.io && this.io.to(notificationDto.userId)) {
        this.io
          // .to(client.id)
          .emit('notifications-list', notifications);
      }
    } catch (error) {
      this.logger.error('Failed to list notifications', error);
      if (this.io && this.io.to(notificationDto.userId)) {
        this.io
          // .to(client.id)
          .emit('notifications-list-error', 'Failed to list notifications');
      }
    }
  }
  /// bring data from client
  emitNotification(notification: Notification) {
    try {
      this.io.emit('new-notification', notification);
      if (notification.user_id) {
        this.io.emit('notifications-list',{userId : notification.user_id});
      }
    } catch (error) {
      console.error('Error emitting notification:', error);
    }
  }
}
