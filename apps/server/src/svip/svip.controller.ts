import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResumeData } from "@reactive-resume/schema";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import SvipService from "./svip.service";

@ApiTags("Svip")
@Controller("svip")
export class SvipController {
  constructor(private readonly svipService: SvipService) {}

  @Post("translateResume")
  @UseGuards(TwoFactorGuard)
  async translateResume(@Body() resumeData: ResumeData) {
    const result = await this.svipService.translateResume(resumeData);
    return result;
  }

  @Post("optimizeResume")
  @UseGuards(TwoFactorGuard)
  async optimizeResume(@Body() resumeData: ResumeData) {
    const result = await this.svipService.optimizeResume2(resumeData);

    return result;
  }
}
