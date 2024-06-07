import { Injectable } from "@nestjs/common";
import { ResumeData } from "@reactive-resume/schema";

import OpenaiService from "../openai/openai.service";
import { getTranslatePrompt } from "../openai/prompt/index";

@Injectable()
export default class SvipService {
  constructor(private readonly openaiService: OpenaiService) {}

  async translateResume(resumeData: ResumeData) {
    // 实现简历翻译逻辑
    const result = await this.openaiService.chatWithGpt(
      getTranslatePrompt(JSON.stringify(resumeData)),
    );
    return result;
  }
}
