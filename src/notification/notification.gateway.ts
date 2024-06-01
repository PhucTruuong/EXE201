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
import { Socket, Namespace, Server } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/jwt-ws.guard';
import { Notification } from 'src/database/dabaseModels/notification.entity';
import { PayloadType } from 'src/auth/types/payload.types';
import { JwtService } from '@nestjs/jwt';
import { CreateNotificationDto } from './dto/create-notification.dto';
export interface NotificationDto {
  userId: string;
}
export interface socketMetaPayLoad extends PayloadType {
  socketId: string;
}
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  // transports: ['websocket'],
  namespace: 'api/notification',
  // cors: {
  //   origin: ['http://localhost:3000', 'https://fureverfriend.id.vn'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: [''],
  //   credentials: true,
  // },
  cors: true,
  crossOriginIsolated: true,
})
@UseGuards(WsJwtGuard)
export class NotificationGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateWay.name);
  constructor(
    private readonly notificationServices: NotificationService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer() io: Namespace;
  server: Server;
  socketMap = new Map<string, socketMetaPayLoad>();
  afterInit(): void {
    this.logger.log('Web socket initialization');
  }

  //******** Start  */
  async handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    const token = client.handshake.query.token as string;
    const payload = (await this.jwtService.verify(token, {
      secret: 'jwt-secret_nam_vip_pro',
    })) as any;

    this.socketMap.set(payload.userId, {
      ...payload,
      socketId: client.id,
    });
    console.log('socketMap', this.socketMap);
    this.io.emit('hello', ` from || ${client.id}`);
    this.logger.log(`WS Client with id ${client.id} connected`);
    this.logger.debug(`Number of connect sockets:: ${sockets.size} `);
    // handle authentication
    // console.log('token Socket', token);
    // if(!token){
    //   client.disconnect(true)
    //   this.logger.log(`Disconnect due to authorization`);
    // }
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.socketMap.delete(client.id);
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
    this.io.emit('new-notification', notification);
  }
  @SubscribeMessage('currentUsers')
  getCurrentUser(client: Socket) {
    client.emit('currentUsers', Array.from(this.socketMap.values()));
  }

  async emitDemoNotification(
    userId: string,
    notification: CreateNotificationDto,
  ) {
    const socketMeta = this.socketMap.get(userId);
    const notificationUser =
      await this.notificationServices.create(notification);
    if (socketMeta) {
      this.io
        .to(socketMeta?.socketId)
        .emit('notifications-user', notificationUser);
    } else {
      console.log('user is not online');
    }
  }

  async emitListNotifications(userId: string) {
    const socketMeta = this.socketMap.get(userId);
    const notifications = await this.notificationServices.find(userId);
    if (socketMeta) {
      this.io
        .to(socketMeta?.socketId)
        .emit('notifications-lists', notifications);
    } else {
      console.log('user is not online');
    }
  }
}
