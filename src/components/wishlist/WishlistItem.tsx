import { PropsWithChildren } from "react";

export function WishlistItem({ children }: PropsWithChildren) {
  return <div className="flex flex-col items-start gap-5">{children}</div>;
}
