import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "@reactive-resume/dto";
import AlipaySdk from "alipay-sdk";
import { PrismaService } from "nestjs-prisma";

import { AlipayOptions } from "./alipay.module";
import { PRE_CREATE_PAY, TRADE_QUERY_PAY } from "./common/constants";

type PreCreateOrderType = {
  code: string;
  msg: string;
  outTradeNo: string;
  qrCode: string;
  traceId: string;
};

@Injectable()
export class AlipayService {
  private _alipaySdk: AlipaySdk = new AlipaySdk({
    appId: this.alipayOptions.appId,
    privateKey: this.alipayOptions.privateKey,
    alipayPublicKey: this.alipayOptions.alipayPublicKey,
    gateway: this.alipayOptions.gateway,
  });
  constructor(
    @Inject("ALIPAY_OPTIONS") private readonly alipayOptions: AlipayOptions,
    private prisma: PrismaService,
  ) {}

  private get alipaySdk() {
    return this._alipaySdk;
  }

  async preCreateOrder(order: CreateOrderDto) {
    try {
      const result = (await this.alipaySdk.exec(PRE_CREATE_PAY.ALIPAY, {
        bizContent: {
          out_trade_no: order.id,
          total_amount: order.totalPrice,
          subject: order.orderType,
        },
      })) as PreCreateOrderType;

      return result;
    } catch (error) {
      console.log(error, "error");
      throw new HttpException("alipaySdk PRE_CREATE_PAY ERROR", HttpStatus.FAILED_DEPENDENCY);
    }
  }

  // query
  async queryByAliPay(orderId: CreateOrderDto["id"]) {
    try {
      const result = await this.alipaySdk.exec(TRADE_QUERY_PAY.ALIPAY, {
        bizContent: {
          out_trade_no: orderId,
        },
      });
      return result;
    } catch (error) {
      console.log(error, "error");
      throw new HttpException("alipaySdk TRADE_QUERY_PAY ERROR", HttpStatus.FAILED_DEPENDENCY);
    }
  }
}
