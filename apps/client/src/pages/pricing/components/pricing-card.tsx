import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

import { useOrder, usePricing, useProducts } from "@/client/services/pricing/order";
import { usePay } from "@/client/services/pricing/pay";
import { useUser } from "@/client/services/user";

// import { useProduct } from "@/client/services/pricing/product";
import CheckItem from "./check-item";

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => {
  // const { createProduct } = useProduct();
  const { allOrders } = useOrder();
  const { createOrder } = usePricing();
  const { allProducts } = useProducts();
  const { setUnpaidOrder } = usePay();
  const { user } = useUser();

  async function onCreateOrder() {
    console.log(user, "user", allProducts, allOrders);
    const data = await createOrder({
      orderType: "VM_SERVE_VIP",
      products: allProducts?.map((item) => item.id) ?? [],
      orderStatus: "PENDING",
      totalPrice: 9.9,
      quantity: 1,
    });

    setUnpaidOrder(data);
    // await createProduct({
    //   price: 9.9,
    //   productName: "Pro版本",
    // });
  }
  return (
    <Card
      className={cn(
        `flex w-72 flex-col justify-between py-1 ${popular ? "border-rose-400" : "border-zinc-700"} mx-auto sm:mx-0`,
        {
          "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
            exclusive,
        },
      )}
    >
      <div>
        <CardHeader className="pb-8 pt-4">
          {isYearly && yearlyPrice && monthlyPrice ? (
            <div className="flex justify-between">
              <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">{title}</CardTitle>
              <div
                className={cn(
                  "h-fit rounded-xl bg-zinc-200 px-2.5 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white",
                  {
                    "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ": popular,
                  },
                )}
              >
                相比月付节省 ¥{Math.floor(monthlyPrice * 12 - yearlyPrice)}
              </div>
            </div>
          ) : (
            <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">{title}</CardTitle>
          )}
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-bold">
              {yearlyPrice && isYearly
                ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  "¥" + yearlyPrice
                : monthlyPrice
                  ? "¥" + monthlyPrice
                  : "Custom"}
            </h3>
            <span className="mb-1 flex flex-col justify-end text-sm">
              {yearlyPrice && isYearly ? "/年" : monthlyPrice ? "/月" : null}
            </span>
          </div>
          <CardDescription className="h-12 pt-1.5 text-sm text-zinc-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        <Button
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black"
          onClick={onCreateOrder}
        >
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b opacity-75 blur" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
