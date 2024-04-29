import { PropsWithChildren } from "react";

export function WishItemList({ children }: PropsWithChildren) {
  return <div className="flex flex-col items-start gap-2">{children}</div>;
}
