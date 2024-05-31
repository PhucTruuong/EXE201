import { InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';

export interface IPayment {
  create(): Promise<object>;
  callbackZaloPay(req:Request): Promise<object | InternalServerErrorException>;
  checkStatusOrder(req:Request): Promise<object | InternalServerErrorException>;
  
  createByMomo(): Promise<object | InternalServerErrorException>;



}
