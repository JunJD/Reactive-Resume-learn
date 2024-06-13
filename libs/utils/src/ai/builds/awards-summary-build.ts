import { Predict, PromptComponent } from "../types";

const predict: Predict = (code: string) => {
  return code === "sections.awards.items-summary";
};
export const awardsSummaryBuild: PromptComponent = (origin: string) => {
  const build = (context: { key: string; value: string }) => {
    return `请结合我的简历：
      """
      ${origin}
      """
      ,扮演一名行业专家，指导我好好的修改这份简历的这部分内容:
      """
      ${context.value}
      """
      ,这部分是个人奖项部分的概览，只需要关注这部分：
      `;
  };
  return {
    predict,
    build,
  };
};
