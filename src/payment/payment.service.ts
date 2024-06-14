import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { Request } from 'express';
import { PaymentPagination } from './dto/payment-pagination.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository

  ) { };

  public async create(booking: any, price: number) {
    return this.paymentRepository.create(booking, price)
  };

  public async createByMomo() {
    return this.paymentRepository.createByMomo()
  };

  public async callbackZaloPay(req: Request): Promise<object | InternalServerErrorException> {
    return this.paymentRepository.callbackZaloPay(req)
  };

  public async checkOrderStatus(req: Request): Promise<object | InternalServerErrorException> {
    return this.paymentRepository.checkStatusOrder(req)
  };

  public async getAllPayment(pagination: PaymentPagination): Promise<
    {
      data: object[],
      totalCount: number
    } |
    InternalServerErrorException |
    NotFoundException |
    BadRequestException
  > {
    return this.paymentRepository.getAllPayment(pagination)
  };
}
