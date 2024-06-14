import { Predict, PromptComponent } from "../types";

const predict: Predict = (code: string) => {
  return code === "sections.summary.content";
};
export const summaryContentBuild: PromptComponent = (origin: string) => {
  console.log(origin, "origin");
  const build = (context: { key: string; value: string }) => {
    return `
    You're an expert in everything. Optimize the "${context.value}" section of your resume. For example
      “”“
      1. **Situation** 
      > Before：在多个渠道中主要运营知乎机构账号，自主选题、创作，并监测数据
      > 
      > 
      > After：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，自主选题、创作，并监测数据
      > 

      1. **Task**

      > Before：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，自主选题、创作，并监测数据
      > 
      > 
      > After：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，为达到 2% 的注册转化率，进行自主选题、创作，并监测数据
      > 
      1. **Action：**

      > Before：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，为达到 2% 的注册转化率，进行自主选题、创作，并监测数据
      > 
      > 
      > After：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，为达到 2% 的注册转化率，根据监测到的知乎问题数据进行选题，每月产出 8 篇文章，并跟进文章一个月内的数据
      > 
      1. result

      > Before：xxx是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，为达到 2% 的注册转化率，根据监测到的知乎问题数据进行选题，每月产出 8 篇文章，并跟进文章一个月内的数据
      > 
      > 
      > After：半撇私塾是新媒体在线教育机构，主要通过内容营销获取用户，我主要负责以知乎作为主要的内容渠道，为达到 2% 的注册转化率，根据监测到的知乎问题数据进行选题，每月产出 8 篇文章，并跟进文章一个月内的数据，在2 个月内带来 XX 名注册用户，注册转化率达到 3%。
      > 
      “”“
      Straight back to the content, no pleasantries required and Do not include \\\\.
      ：`;
  };
  return {
    predict,
    build,
  };
};
