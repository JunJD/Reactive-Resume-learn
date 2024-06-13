export type Context = {
  key: string;
  value: string;
};

export type PromptComponent = (origin: string) => {
  predict: Predict;
  build: Build;
};

export type Predict = (code: string) => boolean;
export type Build = (context: Context) => string;
