import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Socket, Namespace } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/jwt-ws.guard';
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
  namespace: 'api/v1/notification',
  transports: ['websocket'],
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  },
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
  // server: Server;
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
    console.log("socket maop" , this.socketMap)
    this.io.emit('hello', ` from || ${client.id}`);
    this.logger.log(`WS Client with id ${client.id} connected`);
    this.logger.debug(`Number of connect sockets:: ${sockets.size} `);
  }
  handleDisconnect(client: Socket) {
    this.socketMap.forEach((value, key) => {
      if (value.socketId === client.id) {
        this.socketMap.delete(key);
      }
    });
    this.socketMap.delete(client.id);
    this.logger.log(`Disconnect Client with id ${client.id} connected`);
    this.logger.debug(`Number of connect sockets:: ${this.io.sockets.size} `);
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
         .to(socketMeta.socketId)
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








// test
  // return data for client with notifications
  // @SubscribeMessage('list-notifications')
  // async handleListNotifications(
  //   @MessageBody() notificationDto: { userId: string },
  //   // client:Socket
  // ): Promise<void> {
  //   try {
  //     console.log('Received userId:', notificationDto.userId);
  //     const notifications = await this.notificationServices.find(
  //       notificationDto.userId,
  //     );
  //     console.log('Retrieved notifications:', notifications);
  //     if (this.io && this.io.to(notificationDto.userId)) {
  //       this.io
  //         // .to(client.id)
  //         .emit('notifications-list', notifications);
  //     }
  //   } catch (error) {
  //     this.logger.error('Failed to list notifications', error);
  //     if (this.io && this.io.to(notificationDto.userId)) {
  //       this.io
  //         // .to(client.id)
  //         .emit('notifications-list-error', 'Failed to list notifications');
  //     }
  //   }
  // }