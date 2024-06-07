import { Module } from "@nestjs/common";

import { AlipayModule, AlipayOptions } from "../alipay/alipay.module";
import OrdersController from "./orders.controller";
import OrdersService from "./orders.service";

const alipayOptions = {
  appId: process.env.ALIPAY_APP_ID,
  privateKey: process.env.ALIPAY_PRIVATE_KEY,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
  gateway: process.env.GATEWAY,
} as AlipayOptions;

@Module({
  imports: [AlipayModule.forRoot(alipayOptions)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
