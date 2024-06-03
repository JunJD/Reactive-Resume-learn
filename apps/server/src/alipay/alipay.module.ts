import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { AlipayService } from "./alipay.service";

export type AlipayOptions = {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  gateway: string;
};

@Module({
  imports: [HttpModule],
  providers: [AlipayService],
  exports: [AlipayService],
})
export class AlipayModule {
  static forRoot(alipayOptions: AlipayOptions) {
    return {
      module: AlipayModule,
      providers: [
        {
          provide: "ALIPAY_OPTIONS",
          useValue: alipayOptions,
        },
        AlipayService,
      ],
      exports: [AlipayService],
    };
  }
}
