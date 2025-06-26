import { PropsWithChildren, ReactNode } from "react";
import { cn } from "~/utils/classnames";

export function Scrollable({
  children,
  footer,
  className,
}: PropsWithChildren<{ footer: ReactNode; className?: string }>) {
  return (
    <div className={cn("relative grid h-full w-full grid-rows-[auto_max-content] gap-4 overflow-y-auto", className)}>
      <div className="pb-4">{children}</div>
      <div className="sticky bottom-4 flex justify-center">{footer}</div>
    </div>
  );
}

export function WithStickyFooter({
  children,
  footer,
}: PropsWithChildren<{ footer: ReactNode; backgroundColor?: string }>) {
  return (
    <>
      <div className="grow pb-4">{children}</div>
      <div className="sticky bottom-4 flex justify-center">{footer}</div>
    </>
  );
}
