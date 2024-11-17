import * as RadixVisuallyHidden from "@radix-ui/react-visually-hidden";
import { PropsWithChildren } from "react";

export function VisuallyHidden({ children }: PropsWithChildren) {
  return <RadixVisuallyHidden.Root>{children}</RadixVisuallyHidden.Root>;
}
