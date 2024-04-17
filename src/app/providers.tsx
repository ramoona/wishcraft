"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
