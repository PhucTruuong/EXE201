import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { Request } from 'express';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository

  ){}
  create(booking:any,price:number) {
    return this.paymentRepository.create(booking,price)
  }
  createByMomo() {
    return this.paymentRepository.createByMomo()
  }
  callbackZaloPay(req:Request): Promise<object | InternalServerErrorException>{
       return this.paymentRepository.callbackZaloPay(req)
  }
  checkOrderStatus(req:Request): Promise<object | InternalServerErrorException>{
    return this.paymentRepository.checkStatusOrder(req)
  }
  
}
