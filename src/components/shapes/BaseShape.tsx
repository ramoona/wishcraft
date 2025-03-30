import { Path1 } from "~/components/shapes/Paths";
import { cn } from "~/utils/classnames";

type ShapeProps = {
  fill: string;
  className?: string;
};

export function Shape1({ fill, className }: ShapeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202 202" fill="none" className={cn("w-full", className)}>
      <Path1 fill={fill} />
    </svg>
  );
}
