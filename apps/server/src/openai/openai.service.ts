import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { loadSummarizationChain } from "langchain/chains";

import { GENERATIVE_AI_MODULE_OPTIONS } from "./constants";
import { OpenaiModuleOptions } from "./interfaces";
@Injectable()
export default class OpenaiService {
  private chatModel!: ChatOpenAI;
  private static instance: OpenaiService;

  constructor(
    @Inject(GENERATIVE_AI_MODULE_OPTIONS)
    protected readonly options: OpenaiModuleOptions,
    private readonly httpService: HttpService,
  ) {
    this.chatModel = new ChatOpenAI({
      openAIApiKey: this.options.modelApiKey,
      configuration: {
        baseURL: this.options.modelApiUrl,
      },
      model: "gpt-4", // or 'gpt-4'
    });
    // 测试可用性
    OpenaiService.instance = this;
  }

  public static getInstance(): OpenaiService {
    return OpenaiService.instance;
  }

  async chatWithGpt2(prompt: string) {
    const response = await this.httpService.axiosRef.post(
      this.options.modelApiUrl + "/chat/completions",
      {
        messages: [
          {
            role: "system",
            content:
              "You have 10 years of experience in various industries. also good at CV modification and guidance.utput content without any superfluous symbols, if the user needs to use symbols, please use HTML tags. then, Note that the return format must be complete, don't [JSON.parse] Symbols that cannot be parsed, don‘t markdown",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.modelApiKey}`,
        },
      },
    );
    console.log("当前消耗token：", response.data.usage.total_tokens);
    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage.total_tokens,
    };
  }

  async generateFeedbackOnInputWithGuidelines(
    input: string,
    guidelines: string[],
  ): Promise<string> {
    const formattedGuidelines = guidelines.map((guideline) => `- ${guideline}`).join("\n");

    const outputParser = new StringOutputParser();

    const chain = this.chatModel.pipe(outputParser);

    const prompt = `
    When evaluating a user's submission against the provided guidelines, if all criteria are met, respond with "It's good." If the submission fails to meet any of the guidelines, formulate direct and actionable questions for the user. These questions should be framed in a way that they can serve as clear and specific error messages, guiding the user to provide the missing or unclear information. Ensure each question directly relates to a specific guideline that has not been met, avoiding repetition for criteria already satisfied.

    Submission Details: 
    "${input}"

    Guidelines to Assess Against:
    ${formattedGuidelines}

    Based on these instructions, generate feedback that zeroes in on any information that is either missing without reiterating requests for information that has been clearly stated in the submission.`;

    console.log(prompt, "prompt");

    const result = await chain.invoke(prompt);

    return result;
  }

  async summarizeDocuments(docs: Document[]): Promise<string> {
    const summarizeChain = loadSummarizationChain(this.chatModel, {
      type: "stuff",
    });

    const result = await summarizeChain.invoke({ input_documents: docs });

    return result.text;
  }
}
