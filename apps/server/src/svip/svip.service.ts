import { Injectable } from "@nestjs/common";
import { ResumeData } from "@reactive-resume/schema";
import { FieldsManage, Json } from "@reactive-resume/utils";
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
                const prompt = build({ key, value: str });
                let currentValue;
                try {
                  const { content, usage } = await this.openaiService.chatWithGpt2(prompt);
                  totalUsage += usage as number;
                  currentValue = JSON.parse(content);
                } catch {
                  currentValue = value;
                }
                return currentValue;
              }),
            );
            processingPathField[key] = translatedValue;
            console.log("当前执行转换后value==>", processingPathField[key]);
          } else {
            const prompt = build({ key, value });

            let translatedValue;
            try {
              const { content, usage } = await this.openaiService.chatWithGpt2(prompt);
              totalUsage += usage as number;
              translatedValue = content;
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

  async optimizeResume2(resumeData: ResumeData) {
    // 实现简历翻译逻辑
    const fieldsManage = new FieldsManage();
    // const promptsStore = getPromptsStore(JSON.stringify(resumeData.sections));
    // const transBase = new TransBase(resumeData);

    const pendingPathField = fieldsManage.extractFields(resumeData);
    let processingPathField: Json<string | string[]> = {};

    // console.log(promptsStore.length, "promptsStore");
    let totalUsage = 0;
    const { content, usage } = await this.openaiService.chatWithGpt2(
      `You have 10 years of experience in various industries. I am also good at CV modification and guidance. This is the data of my CV, which I have organized into json format for your convenience.
      Refer to:
      “”“
      ${JSON.stringify(resumeData)}
      ”“”
      To give advice.
      There are necessary restrictions on the format in which you give your suggestions (must be returned as such)
      For example：
      
      {
        suggest: '这个简历可以参照star法则，把每个部分都按照star法则来写，这样可以让简历更加吸引人。正如修改所示，我们将xx改成了xx，这样有利于xxxxx',
        pathField: ${JSON.stringify(pendingPathField)}
      }
      上面的例子仅是参考，不要原封不动的使用内容。
      Where suggest is your modification of this resume and the reason for your current modification, pathField key is the path value requires you to use your expertise and resume revision suggestions to fill in the optimized content, and value is what you need to fill in the modified content here.
      These need to be filled keys：${Object.keys(pendingPathField).join(", ")}, Note that if the key is available, it needs to be handled flexibly. If it needs to be completed, it can be completed according to the resume. If it cannot be completed, it does not need to be processed
      Note that the return format must be complete, I need to use JSON.parse(content) to parse your return content
      Back in the object, everything except key must be in Chinese
      `,
    );
    totalUsage += usage as number;
    console.log("totalUsage===>", totalUsage);
    // console.log(content, "content");
    try {
      const newContent = JSON.parse(content);
      const { suggest, pathField } = newContent;
      processingPathField = pathField;
      console.log(suggest, "suggest");
      console.log(pathField, "pathField");
    } catch {
      console.log("出错了！");
    }

    const newData = fieldsManage.replaceField(processingPathField, resumeData);
    return newData;
  }
}
