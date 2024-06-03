import { t } from "@lingui/macro";
import { Chat } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import { toast } from "@/client/hooks/use-toast";
async function handleClick() {
  await navigator.clipboard.writeText(t`DiNgJuNjIE_22`);
  toast({
    variant: "success",
    title: t`The micro signal has been copied to the clipboard`,
  });
}
export const DonationBanner = () => {
  return (
    <motion.a
      target="_blank"
      whileHover={{ height: 48 }}
      initial={{ opacity: 0, y: -50, height: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      className="hidden w-screen select-none items-center justify-center gap-x-2 bg-zinc-800 text-xs font-bold leading-relaxed text-zinc-50 lg:flex"
      onDoubleClick={handleClick}
    >
      <Chat weight="bold" size={14} className="shrink-0" />
      <span>
        {t`If you have any questions, contact me. Wechat ID`}: {t`DiNgJuNjIE_22`}
      </span>
    </motion.a>
  );
};
