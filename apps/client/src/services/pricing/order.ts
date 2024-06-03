import { CreateOrderDto, CreateProductDto, OrderType } from "@reactive-resume/dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

// import { queryClient } from "@/client/libs/query-client";

type addOrder = Partial<CreateOrderDto>;

export const createOrder = async (data: addOrder): Promise<OrderType | null> => {
  const response = await axios.post<OrderType, AxiosResponse<OrderType>, addOrder>("/orders", data);

  return response.data;
};

export const queryAllProducts = async () => {
  const response = await axios.get<CreateProductDto[], AxiosResponse<CreateProductDto[]>>(
    "/products",
  );

  return response.data;
};

export const queryAllOrders = async (params: { page?: number; limit?: number }) => {
  const response = await axios.get<CreateOrderDto, AxiosResponse<CreateOrderDto>>("/orders", {
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });

  return response.data;
};

const useProducts = () => {
  const {
    error,
    isPending: loading,
    data: allProducts,
  } = useQuery({
    queryKey: ["/products"],
    queryFn: queryAllProducts,
  });

  return { allProducts, loading, error };
};

const usePricing = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createOrderFn,
  } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      console.log("usePricing", data);
    },
  });

  return { createOrder: createOrderFn, loading, error };
};

const useOrder = () => {
  const {
    error,
    isPending: loading,
    data: allOrders,
  } = useQuery({
    queryKey: ["/orders"],
    queryFn: queryAllOrders.bind(null, { page: 1, limit: 10 }),
  });

  return { allOrders, loading, error };
};

export { useOrder, usePricing, useProducts };
