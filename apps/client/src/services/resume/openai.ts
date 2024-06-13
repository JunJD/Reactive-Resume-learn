import { t } from "@lingui/macro";
import { ResumeData } from "@reactive-resume/schema";
import { FieldsManage, Json, TransBase } from "@reactive-resume/utils";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/client/hooks/use-toast";
import { axios } from "@/client/libs/axios";

export const translateResume = async (data: ResumeData) => {
  const response = await axios.post<ResumeData>("/svip/translateResume", data);

  return response.data;
};

export const optimizeResumeFetch = async (data: ResumeData) => {
  const response = await axios.post<ResumeData>("/svip/optimizeResume", data);

  return response.data;
};

export const useAiTranslate = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: translateResumeFn,
  } = useMutation({
    mutationFn: translateResume,
    onError: (error) => {
      const message = error.message;

      toast({
        variant: "error",
        title: t`Oops, the server returned an error.`,
        description: message,
      });
    },
  });

  return { translateResume: translateResumeFn2, loading, error };
};

const translateResumeFn2 = async (data: ResumeData): Promise<ResumeData> => {
  const fieldsManage = new FieldsManage();
  const transBase = new TransBase(data);

  const pendingPathField = fieldsManage.extractFields(data);
  const processingPathField: Json<string | string[]> = {};

  for (const [key, value] of Object.entries(pendingPathField)) {
    const translatedValue = await transBase.translateText(value);
    processingPathField[key] = translatedValue;
  }

  const processedPathField = processingPathField;
  const newData = fieldsManage.replaceField(processedPathField, data);
  console.table({ processedPathField, data, newData });
  return newData as ResumeData;
};

export const useAiOptimizeResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: optimizeResumeFn,
  } = useMutation({
    mutationFn: optimizeResumeFetch,
    onError: (error) => {
      const message = error.message;

      toast({
        variant: "error",
        title: t`Oops, the server returned an error.`,
        description: message,
      });
    },
  });

  return { optimizeResume: optimizeResumeFn, loading, error };
};
