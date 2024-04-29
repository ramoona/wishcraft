import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <main className="flex min-h-screen flex-col items-start gap-4 p-8">{children}</main>;
}
