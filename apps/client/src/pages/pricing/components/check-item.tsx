import { CheckCircle } from "@phosphor-icons/react";

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
  </div>
);

export default CheckItem;
