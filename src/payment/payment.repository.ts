import { IPayment } from './payment.interface';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import * as crypto from 'crypto';
import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { Request } from 'express';
import * as qs from 'qs';
import { Booking } from 'src/database/dabaseModels/booking.entity';
import { Payment } from 'src/database/dabaseModels/payment.entity';
import { PaymentPagination } from './dto/payment-pagination.dto';

const config = {
  app_id: '2554',
  key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

interface CallbackResult {
  returncode: number;
  returnmessage: string;
}
export class PaymentRepository implements IPayment {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private readonly bookingModel: typeof Booking,
    @Inject('PAYMENT_REPOSITORY')
    private readonly paymentModel: typeof Payment,
  ) { };

  public async create(booking: any, price: number): Promise<object> {
    const embed_data = {
      merchantinfo: 'embeddata123',
      redirecturl: 'https://fureverfriend.id.vn/api/',
    };

    const items = [booking];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'FueverFriend- Petcare',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: price,
      description: `FueverFriend- Petcare - Payment for the booking #${transID}`,
      bank_code: '',
      callback_url:
        'https://fureverfriend.id.vn/api/v1/payment/callback',
      mac: '',
    };

    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log('result', result.data);
      return result.data;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create payment order');
    }
  };

  private configKey = {
    key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
  };

  public async callbackZaloPay(
    req: Request,
  ): Promise<object | InternalServerErrorException> {
    const result: CallbackResult = {
      returncode: 0,
      returnmessage: '',
    };

    try {
      const dataStr = req.body.data;
      const reqMac = req.body.mac;

      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.returncode = -1;
        result.returnmessage = 'mac not equal';
      } else {
        const dataJson = JSON.parse(dataStr);
        // update status
        console.log('dataJson =', dataJson);
        // Extract id and status_string
        const items = JSON.parse(dataJson.item);
        const itemId = items[0].id;

        await this.bookingModel.update(
          {
            status_string: 'paid',
          },
          { where: { id: itemId } },
        );
        result.returncode = 1;
        result.returnmessage = 'success';
      }
    } catch (error) {
      result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.returnmessage = 'success';
    }

    return result;
  }

  public async createByMomo(): Promise<object | InternalServerErrorException> {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl =
      'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = 'payWithMethod';
    const amount = '50000';
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    // const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    //Create the HTTPS objects
    const options = {
      method: 'POST',

      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const result = await axios(options);
      return result.data;
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
    //Send the request and get the response
  };

  public async checkStatusOrder(
    req: Request,
  ): Promise<object | InternalServerErrorException> {
    const { app_trans_id } = req.body;

    const postData = {
      app_id: config.app_id,
      app_trans_id,
      mac: '',
    };
    const data =
      postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    console.log('post Data', postData);

    const postConfig = {
      method: 'post',
      url: 'https://sb-openapi.zalopay.vn/v2/query',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };
    try {
      const result = await axios(postConfig);
      console.log(result.data);
      return result.data;
      /**
       * kết quả mẫu
        {
          "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
          "return_message": "",
          "sub_return_code": 1,
          "sub_return_message": "",
          "is_processing": false,
          "amount": 50000,
          "zp_trans_id": 240331000000175,
          "server_time": 1711857138483,
          "discount_amount": 0
        }
      */
    } catch (error) {
      console.log('lỗi');
      console.log(error);
    }
  };

  public async getAllPayment(pagination: PaymentPagination): Promise<
    {
      data: object[];
      totalCount: number
    } |
    InternalServerErrorException |
    NotFoundException |
    BadRequestException
  > {
    try {
      if (pagination.page === undefined && pagination.limit === undefined) {
        const payments = await this.paymentModel.findAll({
          attributes: [
            'id',
            'amount',
            'payment_date',
            'status'
          ],
          include: [
            {
              model: Booking,
              as: 'booking',
              attributes: ['booking_date', 'status_string'],
              required: true,
            },
          ],
          order: [['payment_date', 'DESC']],
          group: ['payment.id', 'booking.user_id', 'booking.id'],
        });

        if (!payments || payments.length === 0) {
          return new NotFoundException('There is no payment in the system!');
        };

        return {
          data: payments,
          totalCount: 1,
        };
      };

      if (
        (!pagination.limit && pagination.page) ||
        (pagination.limit && !pagination.page)
      ) {
        return new BadRequestException('Please provide limit and page!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;

      const findOptions: any = {
        attributes: [
          'id',
          'amount',
          'payment_date',
          'status'
        ],
        include: [
          {
            model: Booking,
            as: 'booking',
            attributes: ['booking_date', 'status_string'],
            required: true,
          },
        ],
        order: [['payment_date', 'DESC']],
        group: ['payment.id', 'booking.id', 'booking.user_id'],
      };

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      };

      const payments = await this.paymentModel.findAll(findOptions);

      const numberOfPages = Math.ceil(payments.length / pagination.limit);

      if (!payments || payments.length === 0) {
        return new NotFoundException('There is no payment in the system!');
      } else {
        return {
          data: payments,
          totalCount: numberOfPages,
        };
      };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error.message);
    }
  }
}
