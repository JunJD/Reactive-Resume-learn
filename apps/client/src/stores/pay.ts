import { OrderType } from "@reactive-resume/dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PayState = {
  unpaidOrder: OrderType | null;
};

type PayActions = {
  setUnpaidOrder: (unpaidOrder: OrderType | null) => void;
};

export const usePayStore = create<PayState & PayActions>()(
  persist(
    (set) => ({
      unpaidOrder: null,
      setUnpaidOrder: (unpaidOrder) => {
        set({ unpaidOrder });
      },
    }),
    { name: "pay" },
  ),
);
