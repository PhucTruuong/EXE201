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
import { Socket, Namespace } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/jwt-ws.guard';
import { Server } from 'http';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'notification',
  cors: true,
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
}
