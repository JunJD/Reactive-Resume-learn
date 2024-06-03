import { ScrollArea } from "@reactive-resume/ui";
import { Outlet } from "react-router-dom";

import { Header } from "../home/components/header";

export const PricingLayout = () => (
  <ScrollArea orientation="vertical" className="h-screen">
    <Header />
    <Outlet />
  </ScrollArea>
);
