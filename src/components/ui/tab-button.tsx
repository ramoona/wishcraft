import { PropsWithChildren } from "react";
import Link from "next/link";
import * as React from "react";
import { cn } from "~/utils/classnames";

export function TabButton({
  isActive,
  route,
  children,
  withCount,
}: PropsWithChildren<{ isActive?: boolean; route: string; withCount?: boolean }>) {
  return (
    <Link
      href={route}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex h-8 grow items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm",
        "font-medium no-underline ring-offset-background transition-all focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none",
        "disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground lg:w-full",
        "lg:justify-start lg:px-4 lg:text-left",
        withCount && "pr-1",
      )}
    >
      {children}
    </Link>
  );
}
