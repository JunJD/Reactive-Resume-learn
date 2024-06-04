import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reactive-resume/ui";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "@/client/hooks/use-toast";
import { usePay } from "@/client/services/pricing/pay";

export const PayPage = () => {
  document.title = "支付 支付宝 - 10万积分";
  const { unpaidOrder, startPollingGetUnpaidOrderStatus } = usePay();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") ?? "/dashboard/resumes";
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      if (!unpaidOrder) return;
      await startPollingGetUnpaidOrderStatus(unpaidOrder.id);
    }
    void run();
  }, []);

  useEffect(() => {
    if (!unpaidOrder) {
      toast("支付成功，支付完成");
      navigate(redirect);
    }
  }, [unpaidOrder]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-100">
      <Card className="mx-auto mt-10 flex w-96 flex-col justify-between border-zinc-700 bg-white bg-[length:200%_100%] pt-10 sm:mx-0">
        <div>
          <CardHeader className="pb-2">
            <img className="mx-auto h-12" src="./alipay-logo.png" alt="alipay" height="30px" />
            <CardDescription className="h-12 pt-1.5 text-center text-sm text-zinc-500">
              商品名称：10万积分
            </CardDescription>
            <CardTitle>
              <p className="text-center text-xl">
                <span className="text-red-500">¥10.00</span> (不可多付或少付)
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <QRCodeSVG
              value={unpaidOrder ? unpaidOrder.paymentInfo.qrCode : ""}
              className="mx-auto"
              size={200}
            />
          </CardContent>
        </div>
        <CardFooter className="flex-col">
          <div className="cursor-pointer text-center text-xl text-zinc-500">付不了款点我</div>
          <div>
            二维码有效时间：
            <span className="text-2xl text-red-500">10</span>分
            <span className="text-2xl text-red-500">10</span>秒{/* 失效误付 */}
          </div>
          <div>如失效，请重新下单</div>
          <div>
            商户订单号:
            <span>{unpaidOrder?.paymentInfo.orderId}</span>
          </div>
        </CardFooter>
      </Card>
      <img src="./alipay-sys.png" alt="alipay-sys" />
    </div>
  );
};
