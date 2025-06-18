"use client";

import { Shape1, Shape2, Shape3, Shape4 } from "~/components/shapes/BaseShape";
import { PropsWithChildren } from "react";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";

export function EmptyList({ shape }: PropsWithChildren<{ shape: "1" | "2" | "3" | "4" }>) {
  const Shape = shapes[shape];
  const { t } = useTranslation();
  return (
    <div className="relative flex grow items-center justify-center px-8 lg:fixed lg:bottom-8 lg:right-8 lg:block lg:w-[40vw] lg:px-0">
      <Shape fill="#FFFFFF" className="max-w-64 sm:max-w-80 lg:max-w-full" />

      <div className="absolute flex size-full items-center justify-center lg:top-1/2 lg:h-fit lg:-translate-y-1/2">
        <span className={cn("text-[#A7A7A7]", offset[shape])}>{t("general.empty")}</span>
      </div>
    </div>
  );
}

const shapes = {
  1: Shape1,
  2: Shape2,
  3: Shape3,
  4: Shape4,
};

const offset = {
  1: "mt-12",
  2: "mt-[-120px]",
  3: "mt-24",
  4: "mt-8",
};
