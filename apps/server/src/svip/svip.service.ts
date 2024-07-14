import { Injectable } from "@nestjs/common";
import { ResumeData } from "@reactive-resume/schema";
import { FieldsManage, findValidJSON, Json } from "@reactive-resume/utils";
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
    // 实现简历优化逻辑
    const fieldsManage = new FieldsManage();

    const pendingPathField = fieldsManage.extractFields(resumeData);
    let processingPathField: Json<string | string[]> = pendingPathField;

    // console.log(promptsStore.length, "promptsStore");
    let totalUsage = 0;
    console.log("chat With Gpt");

    const { content, usage } = await this.openaiService.chatWithGpt2(
      `
      You are a very professional resume optimization expert. Your task now is to process the resume and output an optimized resume.
      You will be provided with the JSON version of the original resume delimited by triple quotes:
      """
      ${JSON.stringify(resumeData)}
      """

      You should handle the original resume in the following steps:

      Step 1 - Analyze the target industry or position the resume is aimed at, as well as the contents of the resume.
      Step 2 - Based on the position and resume contents, think about how you would write this resume as an optimization expert.
      Step 3 - Provide resume optimization suggestions based on your thoughts.
      Step 4 - Optimize the resume based on the suggestions.
      Step 4.1 - If the resume lacks sufficient project experience, add some simulated project experience and company details, and be sure to mark these additions with 【For Reference Only】, array push the new 【For Reference Only】.
      Step 4.2 - If the resume lacks sufficient education experience, add some simulated education experience and school details, and be sure to mark these additions with 【For Reference Only】, array push the new 【For Reference Only】.
      Step 4.3 - If the resume lacks sufficient work experience, add some simulated work experience and company details, and be sure to mark these additions with 【For Reference Only】, array push the new 【For Reference Only】.
      Step 4.4 - If the resume lacks sufficient skills, add some simulated skills, and be sure to mark these additions with 【For Reference Only】, array push the new 【For Reference Only】.
      Step 5 - If your resume is boring, add some 【For Reference Only】 content, You can refer to the content of outstanding resumes for this position.
      Step 7 - Output the suggestions and optimizations in the following format.
      Step 8 - Since your output will be in string format, ensure the content you are about to output supports [JSON.parse(content)] without any errors.
      Step 9 - The following JSON format will be parsed by JavaScript, with the value being either a string or an array of strings. Translate the value strings into Chinese before outputting.
      You will be provided with the output in JSON format delimited by triple quotes:

      """
      {
        suggest: 'xxxxxxx',
        pathField: ${JSON.stringify(
          Object.fromEntries(
            Object.keys(pendingPathField).map((key) => {
              const value = pendingPathField[key];
              if (Array.isArray(value)) {
                return [key, value.map(() => "xxxxx")];
              }
              return [key, "xxxxx"];
            }),
          ),
        )}
      }
      """

      另外该简历的目标岗位JD如下，可以贴合这个岗位JD去【For Reference Only】：
      """
      1、针对小红书内容特性，制定运营策略，做好运营规划及方案;
      2、负责日常稳定输出品牌号内容、维护品牌号形象等;
      3、负责小红书运营，提供优质、有创意有高度传播性的内容，增加粉丝量与粘性，提高转化率;
      4、负责挖掘和收集网友使用习惯、情感及体验感受，即时掌握新闻热点;深入了解互联网，尤其是微信、微博微淘的特点及资源，有效运用相关资源;并实时完成专题策划、编辑制作;
      5、负责统计营销数据，运营数据等;
      任职要求:
      1、熟悉平台内容特点，善于捕捉和利用热点;
      2、具备优秀的文案撰写能力、图文视频审美能力;
      3、有财经行业从业经验优先;
      4、熟悉了解微信小红书等网络推广平台和推广手段;
      5、优秀的沟通协作、写作能力，执行及项目管理能力，强烈的责任心和挑战欲望，能够在复杂环境下承受压力，并协调各项资源，创造性完成目标;
      6、有广告相关从业经验的优先录用;
      7、了解视频拍摄和视频制作者优先
      """
      
      No need to rush; let's think this through carefully.
      `,
    );
    totalUsage += usage as number;
    console.log("totalUsage===>", totalUsage);
    try {
      const newContent = findValidJSON(content)[0];
      const { suggest, pathField } = newContent;
      processingPathField = pathField;
      console.log(suggest, "suggest");
      console.log(pathField, "pathField");
    } catch (error) {
      console.log("出错了！===>", error);
    }

    const newData = fieldsManage.replaceField(processingPathField, resumeData);
    return newData;
  }
}
