import { IPayment } from './payment.interface';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import * as qs from 'qs';
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

interface CallbackResult {
  returncode: number;
  returnmessage: string;
}
export class PaymentRepository implements IPayment {
  async create(): Promise<object> {
    const embed_data = {
      merchantinfo: 'embeddata123',
      redirecturl: 'https://3cb5-14-168-69-208.ngrok-free.app/api',
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
      callback_url:
        'https://3cb5-14-168-69-208.ngrok-free.app/api/v1/payment/callback',
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
  }
  private configKey = {
    key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
  };

  async callbackZaloPay(
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
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        const dataJson = JSON.parse(dataStr);
        console.log(
          "update order's status = success where apptransid =",
          dataJson['apptransid'],
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

  async createByMomo(): Promise<object | InternalServerErrorException> {
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
  }
  async checkStatusOrder(
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
   
   console.log("post Data" , postData)
   
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
  }
}
