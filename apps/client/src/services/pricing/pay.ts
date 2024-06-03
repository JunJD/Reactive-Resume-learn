/* eslint-disable lingui/no-unlocalized-strings */

import { CreateOrderDto } from "@reactive-resume/dto";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { usePayStore } from "@/client/stores/pay";

export const fetchOrderStatus = async (unpaid: string) => {
  const response = await axios.get<CreateOrderDto>(`/orders/${unpaid}?timer=${Date.now()}`);

  return response.data;
};

const stopPolling = (timerId: NodeJS.Timeout) => {
  // 停止定时器
  clearInterval(timerId);
};

const pollOrderStatus = async (unpaid: string) => {
  try {
    const unpaidOrder = await fetchOrderStatus(unpaid);
    // 更新缓存中的订单状态
    queryClient.setQueryData(["orders", unpaid], unpaidOrder);
    return unpaidOrder;
  } catch (error) {
    console.error("Error polling order status:", error);
  }
};

export const usePay = () => {
  const [unpaidOrder, setUnpaidOrder] = usePayStore((state) => [
    state.unpaidOrder,
    state.setUnpaidOrder,
  ]);

  const startPolling = async (unpaid: string, interval = 5000) => {
    // 执行一次查询
    let unpaidOrder = await pollOrderStatus(unpaid);
    // 设置定时器，每隔 interval 毫秒执行一次查询
    const timerId = setInterval(async () => {
      unpaidOrder = await pollOrderStatus(unpaid);
      if (unpaidOrder?.orderStatus === "CANCELLED") {
        console.log(unpaidOrder.orderStatus, "unpaidOrder?.orderStatus");
        stopPolling(timerId);
        setUnpaidOrder(null); // 关闭待支付订单
      }
    }, interval);
  };

  return { unpaidOrder, setUnpaidOrder, startPollingGetUnpaidOrderStatus: startPolling };
};
