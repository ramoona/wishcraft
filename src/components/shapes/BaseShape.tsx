import { Path1 } from "~/components/shapes/Paths";

type ShapeProps = {
  fill: string;
};

export function Shape1({ fill }: ShapeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202 202" fill="none" className="w-full">
      <Path1 fill={fill} />
    </svg>
  );
}
