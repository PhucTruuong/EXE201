import { Logger, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { Socket, Server } from 'socket.io';
import { PayloadType } from 'src/auth/types/payload.types';
import { JwtService } from '@nestjs/jwt';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { RequestWithUser } from 'src/interface/request-interface';
import { WsJwtGuard } from 'src/auth/guard/jwt-ws.guard';
export interface NotificationDto {
  userId: string;
}
export interface socketMetaPayLoad extends PayloadType {
  socketId: string;
}
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'api/v1/notification',
  // transports: ['websocket'],
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:8081',
      'https://api.fureverfriend.id.vn',
      'https://fureverfriend.id.vn',
      'http://localhost:8000'
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  crossOriginIsolated: true,
})
// @UseGuards(WsJwtGuard)
export class NotificationGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateWay.name);
  constructor(
    private readonly notificationServices: NotificationService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer() io: Server;
  // server: Server;
  socketMap = new Map<string, socketMetaPayLoad>();

  afterInit(): void {
    this.logger.log('Web socket initialization successfully');
  };

  public async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (authHeader && (authHeader as string).split(' ')[1]) {
        console.log(authHeader);
      };
      const token = (authHeader as string).split(' ')[1];
      const payload = (await this.jwtService.verify(token, {
        secret: 'jwt-secret_nam_vip_pro',
      })) as any;
      if (!this.socketMap.has(payload.userId)) {
        this.socketMap.set(payload.userId, {
          ...payload,
          socketId: client.id,
        });
        this.logger.log(`WS Client with id ::  ${client.id} connected`);
        this.logger.debug(
          `Number of connected sockets:: ${this.socketMap.size}`,
        );
      } else {
        this.logger.warn(
          `User with id :: ${payload.userId} is already connected.`,
        );
      }
    } catch (error) {
      console.log('error');
      client.emit('unauthorized', 'You are not authenticated');
      client.disconnect();
    };
  };

  public handleDisconnect(client: Socket) {
    let disconnectedUserId: string | null = null;
    this.socketMap.forEach((value, key) => {
      if (value.socketId === client.id) {
        disconnectedUserId = key;
      }
    });

    if (disconnectedUserId) {
      this.socketMap.delete(disconnectedUserId);
      this.logger.log(`WS Client with id :: ${client.id} disconnected`);
      this.logger.debug(`Number of connected sockets:: ${this.socketMap.size}`);
    };
  };

  public async emitDemoNotification(
    userId: string,
    notification: CreateNotificationDto,
  ) {
    const socketMeta = this.socketMap.get(userId);
    const notificationUser =
      await this.notificationServices.create(notification);
    if (socketMeta) {
      this.io
        .to(socketMeta.socketId)
        .emit('notifications-user', notificationUser);
    } else {
      console.log('user is not online');
    };
  };

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('notifications-lists')
  public async emitListNotifications(@Req() req :RequestWithUser) {
    const socketMeta = this.socketMap.get(req.user.userId);
    const notifications = await this.notificationServices.find(
      socketMeta.userId,
    );
    if (socketMeta) {
      this.io
        .to(socketMeta?.socketId)
        .emit('notifications-lists', notifications);
    } else {
      console.log('user is not online');
    };
  };

  //update for me
  @SubscribeMessage('update-notification')
  public async handleUpdateNotification(@MessageBody() data: { id: string }) {
    try {
      const updatedNotification = await this.notificationServices.update(
        data.id,
      );
      return { event: 'update-notification', data: updatedNotification };
    } catch (error) {
      this.logger.error('Failed to update notification', error);
      return {
        event: 'update-notification-error',
        data: 'Failed to update notification',
      };
    };
  };
};
// thằng host tạo, gửi noti cho thằng admin