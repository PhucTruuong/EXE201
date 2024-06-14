import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentPagination } from './dto/payment-pagination.dto';

export interface IPayment {
  create(booking: any, price: number): Promise<object>;
  callbackZaloPay(req: Request): Promise<object | InternalServerErrorException>;
  checkStatusOrder(req: Request): Promise<object | InternalServerErrorException>;
  createByMomo(): Promise<object | InternalServerErrorException>;
  getAllPayment(pagination: PaymentPagination): Promise<
    {
      data: object[];
      totalCount: number
    } |
    InternalServerErrorException |
    NotFoundException |
    BadRequestException
  >;
}
