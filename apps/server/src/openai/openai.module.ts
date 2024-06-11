import { Agent } from "node:https";

import { HttpModule } from "@nestjs/axios";
import { DynamicModule, Module } from "@nestjs/common";

import { GENERATIVE_AI_MODULE_OPTIONS } from "./constants";
import { OpenaiModuleOptions } from "./interfaces";
import OpenaiService from "./openai.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 20_000,
      validateStatus: () => true,
      httpsAgent: new Agent({
        keepAlive: false,
      }),
    }),
  ],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {
  static forRoot(options: OpenaiModuleOptions): DynamicModule {
    return {
      module: OpenaiModule,
      providers: [
        {
          provide: GENERATIVE_AI_MODULE_OPTIONS,
          useValue: options,
        },
        OpenaiService,
      ],
      exports: [OpenaiService],
    };
  }
}
