import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePay } from "@/client/services/pricing/pay";

export const UnpaIdGuard = () => {
  const location = useLocation();
  const redirectTo = location.pathname + location.search;

  const { unpaidOrder } = usePay();

  if (!unpaidOrder) {
    return <Outlet />;
  }

  return <Navigate replace to={`/pay?redirect=${redirectTo}`} />;
};
