// eslint-disable-next-line @nx/enforce-module-boundaries
import { ResumeData } from "@reactive-resume/schema";
import { Json } from "@reactive-resume/utils";
export * from "./get-prompts-store";
export class FieldsManage {
  needTransField = [
    "sections.awards.items-summary",
    "sections.certifications.items-summary",
    "sections.education.items-summary",
    "sections.experience.items-summary",
    "sections.languages.items-description",
    "sections.projects.items-description",
    "sections.projects.items-summary",
    "sections.publications.items-summary",
    "sections.references.items-summary",
    "sections.references.items-description",
    "sections.skills.items-description",
    "sections.summary.content",
    "sections.volunteer.items-summary",
  ];
  getPromptByField(filed: string) {
    return this.needTransField.includes(filed) ? true : false;
  }
  public replaceField(processedPathField: Json<string | string[]>, data: Json): Json {
    const newData = JSON.parse(JSON.stringify(data));

    for (const [path, value] of Object.entries(processedPathField)) {
      setField(newData, path, value);
    }
    function setField(obj: Json | null, path: string, value: string | string[]) {
      // 使用"-"将路径分割为几个部分
      const parts = path.split("-");
      const field = parts[0];
      // 如果路径的第一部分是数组索引，则使用该索引从数组中获取值

      const rest = parts.slice(1).join("-");

      // 进一步用“.”分割第一部分，以处理嵌套字段
      const fieldParts = field.split(".");

      let current: Json | null = obj;

      const lastPath = fieldParts.splice(-1)[0];

      // 使用字段部分遍历JSON对象
      for (const part of fieldParts) {
        if (current) {
          current = current[part] as Json;
        }
      }

      if (!current) {
        return;
      }

      // 如果当前值是一个数组，并且有更多的部分需要处理，则通过该数组进行映射
      if (Array.isArray(current[lastPath]) && rest) {
        const handleValue = current[lastPath] as Json[];

        if (!value || !Array.isArray(value) || value.length !== handleValue.length) {
          return;
        }
        current[lastPath] = handleValue.map((item: Json, index: number) => {
          return setField(item, rest, value[index]);
        });
        return current;
      } else {
        current[lastPath] = value;
        return current;
      }
    }
    return newData;
  }
  public extractFields(data: Json): Json<string | string[]> {
    const result: Json<string | string[]> = {};

    function getField(obj: Json | null, path: string): unknown {
      // 使用"-"将路径分割为几个部分
      const parts = path.split("-");
      const field = parts[0];
      // 如果路径的第一部分是数组索引，则使用该索引从数组中获取值

      const rest = parts.slice(1).join("-");

      // 进一步用“.”分割第一部分，以处理嵌套字段
      const fieldParts = field.split(".");
      let current: Json | null = obj;

      // 使用字段部分遍历JSON对象
      for (const part of fieldParts) {
        if (current) {
          current = current[part] as Json;
        }
      }
      // 如果当前值是一个数组，并且有更多的部分需要处理，则通过该数组进行映射
      if (Array.isArray(current) && rest) {
        return (current as Json[]).map((item: Json) => getField(item, rest));
      }

      // 返回当前值，可以是嵌套的JSON对象或原始值
      return current;
    }

    // 遍历需要转换的每个字段
    for (const field of this.needTransField) {
      //使用辅助函数从数据中获取字段的值并将其添加到结果中
      result[field] = getField(data, field) as string | string[];
    }

    return result;
  }
}

export const Utils = {
  escapeHTML(unsafe: string) {
    return (
      unsafe
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&/g, "&amp;")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\</g, "&lt;")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\>/g, "&gt;")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\"/g, "&quot;")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\'/g, "&#39;")
    );
  },

  unescapeHTML(unsafe: string) {
    return (
      unsafe
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&amp;/g, "&")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&lt;/g, "<")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&gt;/g, ">")
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&quot;/g, '"')
        // eslint-disable-next-line unicorn/better-regex, no-useless-escape
        .replace(/\&\#39;/g, "'")
    );
  },
};

export class TransBase {
  constructor(private readonly data: ResumeData) {}
  public async translateText(text: string | string[]): Promise<string | string[]> {
    return Array.isArray(text)
      ? Promise.all(
          text.map((lineText) => this.translateSimpleLine(this.transformRequest(lineText))),
        )
      : await this.translateSimpleLine(this.transformRequest(text));
  }
  transformRequest(text: string) {
    return Utils.escapeHTML(text);
  }
  transformResponse(text: string) {
    return Utils.unescapeHTML(text);
  }
  async translateSimpleLine(lineText: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.transformResponse("[666]" + lineText));
    });
  }
}
