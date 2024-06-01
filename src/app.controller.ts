import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval, map } from 'rxjs';

interface MessageEvent {
  data: string | object;
}
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('event')
  // async isVerified(@Req() req: RequestWithUser) {
  //   await this.notificationGateWay.emitDemoNotification(
  //     req.user.userId.toString(),
  //     {
  //       title: 'Hello Test',
  //       description: 'Hello Test description',
  //       type: 'info',
  //       user_id: req.user.userId,
  //     },
  //   );
  // }

  @Sse('event')
  sendEvent(): Observable<MessageEvent> {
    // hello 1 -->>2 -->3
    return interval(1000).pipe(
      map((num: number) => ({
        data: 'hello' + num,
      })),
    );
  }
}
