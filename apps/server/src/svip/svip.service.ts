import { Injectable } from "@nestjs/common";
import { ResumeData } from "@reactive-resume/schema";
import { FieldsManage, Json, Utils } from "@reactive-resume/utils";
import { getPromptsStore } from "@reactive-resume/utils";

import OpenaiService from "../openai/openai.service";
import { getTranslatePrompt } from "../openai/prompt/index";

@Injectable()
export default class SvipService {
  constructor(private readonly openaiService: OpenaiService) {}

  async translateResume(resumeData: ResumeData) {
    // 实现简历翻译逻辑
    const result = await this.openaiService.chatWithGpt2(
      getTranslatePrompt(JSON.stringify(resumeData)),
    );
    return result;
  }

  async optimizeResume(resumeData: ResumeData) {
    // 实现简历翻译逻辑
    const fieldsManage = new FieldsManage();
    const promptsStore = getPromptsStore(JSON.stringify(resumeData.sections));
    // const transBase = new TransBase(resumeData);

    const pendingPathField = fieldsManage.extractFields(resumeData);
    const processingPathField: Json<string | string[]> = {};

    console.log(promptsStore.length, "promptsStore");
    let totalUsage = 0;
    for (const { predict, build } of promptsStore) {
      for (const [key, value] of Object.entries(pendingPathField)) {
        console.log("当前执行key==>", key);
        if (predict(key)) {
          console.log("当前执行value==>", value);
          if (Array.isArray(value)) {
            const translatedValue = await Promise.all(
              value.map(async (str) => {
                const prompt = build({ key, value: Utils.escapeHTML(str) });
                let currentValue;
                try {
                  const { content, usage } = await this.openaiService.chatWithGpt2(prompt);
                  totalUsage += usage as number;
                  currentValue = JSON.parse(content);
                } catch {
                  currentValue = value;
                }
                return Utils.unescapeHTML(currentValue);
              }),
            );
            processingPathField[key] = translatedValue;
            console.log("当前执行转换后value==>", processingPathField[key]);
          } else {
            const prompt = build({ key, value: Utils.escapeHTML(value) });

            let translatedValue;
            try {
              const { content, usage } = await this.openaiService.chatWithGpt2(prompt);
              totalUsage += usage as number;
              translatedValue = Utils.unescapeHTML(content);
              console.log(translatedValue, "正确的：translatedValue");
            } catch (error) {
              console.log("出错了:", error);
              translatedValue = `${value}-出错了`;
            }

            console.log(translatedValue, "正确的2：translatedValue");
            processingPathField[key] = translatedValue;

            console.log("当前执行转换后value==>", processingPathField[key]);
          }
        } else {
          console.log("无对于prompt==>", key);
          processingPathField[key] = value;
        }
      }
    }

    const processedPathField = processingPathField;
    console.log(processedPathField, "processedPathField");
    const newData = fieldsManage.replaceField(processedPathField, resumeData);
    console.log("totalUsage", totalUsage);
    return newData as ResumeData;
  }
}
