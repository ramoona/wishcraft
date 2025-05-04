import { Path1, Path2, Path3, Path4 } from "~/components/shapes/Paths";
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

export function Shape2({ fill, className }: ShapeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 214 196" fill="none" className={cn("w-full", className)}>
      <Path2 fill={fill} />
    </svg>
  );
}

export function Shape3({ fill, className }: ShapeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 218" fill="none" className={cn("w-full", className)}>
      <Path3 fill={fill} />
    </svg>
  );
}

export function Shape4({ fill, className }: ShapeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 209" fill="none" className={cn("w-full", className)}>
      <Path4 fill={fill} />
    </svg>
  );
}
