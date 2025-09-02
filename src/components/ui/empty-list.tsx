"use client";

import { Shape1, Shape2, Shape3, Shape4 } from "~/components/shapes/BaseShape";
import { PropsWithChildren } from "react";

export function EmptyList({ shape }: PropsWithChildren<{ shape: "1" | "2" | "3" | "4" }>) {
  const Shape = shapes[shape];
  return (
    <div className="relative flex grow items-center justify-center px-8 lg:fixed lg:bottom-8 lg:right-8 lg:block lg:w-[40vw] lg:max-w-[70vh] lg:px-0">
      <Shape fill="#FFFFFF" className="max-w-64 sm:max-w-80 lg:max-w-full" />
    </div>
  );
}

const shapes = {
  1: Shape1,
  2: Shape2,
  3: Shape3,
  4: Shape4,
};
