import { cn } from "@reactive-resume/utils";

type Props = {
  className?: string;
};

export const Copyright = ({ className }: Props) => (
  <div
    className={cn(
      "prose prose-sm prose-zinc flex max-w-none flex-col gap-y-1 text-xs dark:prose-invert",
      className,
    )}
  >
    <img
      width="100%"
      alt="升级到高级会员"
      className="cursor-pointer"
      src="https://demos.themeselection.com/materio-mui-react-nextjs-admin-template-free/images/misc/upgrade-banner-light.png"
    ></img>
  </div>
);
