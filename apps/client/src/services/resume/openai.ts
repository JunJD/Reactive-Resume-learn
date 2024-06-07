import { t } from "@lingui/macro";
import { ResumeData } from "@reactive-resume/schema";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/client/hooks/use-toast";
import { axios } from "@/client/libs/axios";

export const translateResume = async (data: ResumeData) => {
  console.log(data, "data");
  const response = await axios.post<ResumeData>("/svip/translateResume", data);

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

  return { translateResume: translateResumeFn, loading, error };
};
