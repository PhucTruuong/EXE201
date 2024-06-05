import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard  implements CanActivate{
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token not provided');
    }
    const token = (authHeader as string).split(' ')[1];

    try {
      console.log("Received token:", token);

      // Use JwtStrategy for token validation
      const payload = await this.jwtService.verify(token,{
        secret:"jwt-secret_nam_vip_pro"
      }) as any;
      const request = context.switchToHttp().getRequest();
      request.user = payload;

      console.log("Verified payload:", payload);

      return true;
    } catch (err) {
      console.log("error from auth",err)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
