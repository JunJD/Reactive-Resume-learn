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
    console.log("resumeData", "====");
    const result = await this.svipService.translateResume(resumeData);
    return result;
  }
}
