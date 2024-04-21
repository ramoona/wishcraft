import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <main className="flex min-h-screen flex-col items-center gap-4 p-24">{children}</main>;
}
