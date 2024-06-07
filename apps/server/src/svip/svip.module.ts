import { Module } from "@nestjs/common";

import { OpenaiModule } from "../openai/openai.module";
import { SvipController } from "./svip.controller";
import SvipService from "./svip.service";

@Module({
  imports: [
    OpenaiModule.forRoot({
      modelApiKey: process.env.OPENAI_API_KEY as unknown as string,
      modelApiUrl: process.env.OPENAI_API_URL as unknown as string,
    }),
  ],
  controllers: [SvipController],
  providers: [SvipService],
  exports: [SvipService],
})
export class SvipModule {}
