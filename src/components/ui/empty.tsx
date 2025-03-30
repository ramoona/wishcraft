import { Shape1 } from "~/components/shapes/BaseShape";
import { PropsWithChildren } from "react";

export function Empty({ children }: PropsWithChildren) {
  return (
    <div className="relative flex items-center justify-center px-8">
      <Shape1 fill="#FBFBFB" className="max-w-96" />
      <div className="absolute flex size-full items-center justify-center">
        <span className="mt-10 text-foreground/50">{children}</span>
      </div>
    </div>
  );
}
