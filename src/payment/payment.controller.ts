import { Controller, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('Payments')
@Controller('/api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('zalo-pay')
  create() {
    return this.paymentService.create();
  }
  @Post('momo')
  createByMomo() {
    return this.paymentService.createByMomo();
  }

  @Post('callback')
  callBackZaloPay(@Req() req: Request) {
    return this.paymentService.callbackZaloPay(req);
  }
  @Post('check-status-order')
  checkStatusOrder(@Req() req: Request) {
    return this.paymentService.checkOrderStatus(req);
  }
}
