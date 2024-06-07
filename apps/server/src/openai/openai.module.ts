import { DynamicModule, Module } from "@nestjs/common";

import { GENERATIVE_AI_MODULE_OPTIONS } from "./constants";
import { OpenaiModuleOptions } from "./interfaces";
import OpenaiService from "./openai.service";

@Module({
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
