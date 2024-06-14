import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Query
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentPagination } from './dto/payment-pagination.dto';
import { StandardParam, StandardParams, StandardResponse } from 'nest-standard-response';
import { JwtAdminGuard } from 'src/auth/guard/jwt-admin.guard';

@ApiTags('Payments')
@Controller('/api/v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { };

  @Get('/')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({ summary: 'Get all payment' })
  @StandardResponse({
    isPaginated: true,
  })
  async getAllPayment(
    @Query() pagination: PaymentPagination,
    @StandardParam() standardParam: StandardParams,
  ) {
    const allItems = await this.paymentService.getAllPayment(pagination);

    if (
      allItems instanceof InternalServerErrorException ||
      allItems instanceof HttpException ||
      allItems instanceof BadRequestException ||
      allItems instanceof NotFoundException
    ) {
      return allItems as HttpException | InternalServerErrorException | BadRequestException | NotFoundException;
    } else {
      const { data, totalCount } = allItems;
      standardParam.setPaginationInfo({
        count: totalCount,
        limit: data.length,
      });
      return data;
    };
  };

  @Post('zalo-pay')
  create(@Body() booking: any, price: number) {
    return this.paymentService.create(booking, price);
  }
  @Post('momo')
  createByMomo() {
    return this.paymentService.createByMomo();
  }

  @Post('callback')
  callBackZaloPay(@Req() req: Request) {
    return this.paymentService.callbackZaloPay(req);
  };

  @Post('check-status-order')
  checkStatusOrder(@Req() req: Request) {
    return this.paymentService.checkOrderStatus(req);
  };
};
