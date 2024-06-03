import { AuthResponseDto, CreateProductDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

// import { queryClient } from "@/client/libs/query-client";

type addProduct = Partial<CreateProductDto>;

export const createProduct = async (data: addProduct) => {
  const response = await axios.post<AuthResponseDto, AxiosResponse<AuthResponseDto>, addProduct>(
    "/products",
    data,
  );

  return response.data;
};

export const queryAllProducts = async () => {
  const response = await axios.get<AuthResponseDto, AxiosResponse<AuthResponseDto>>("/products");

  return response.data;
};

const useProduct = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createProductFn,
  } = useMutation({
    mutationFn: queryAllProducts,
    onSuccess: (data) => {
      console.log(data);
      // queryClient.setQueryData(["user"], data.user);
    },
  });

  return { createProduct: createProductFn, loading, error };
};

export { useProduct };
