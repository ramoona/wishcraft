"use client";

import { Shape1, Shape2, Shape3, Shape4 } from "~/components/shapes/BaseShape";
import { PropsWithChildren } from "react";
import { cn } from "~/utils/classnames";
import { useTranslation } from "react-i18next";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";

export function EmptyList({ shape }: PropsWithChildren<{ shape: "1" | "2" | "3" | "4" }>) {
  const Shape = shapes[shape];
  const { t } = useTranslation();
  return (
    <div className="relative flex grow items-center justify-center px-8">
      <MobileOnly>
        <Shape fill="#FFFFFF" className="max-w-64 sm:max-w-80" />
      </MobileOnly>
      <DesktopOnly>
        <Shape fill="#D8D6D6" className="max-w-64 sm:max-w-80" />
      </DesktopOnly>
      <div className="absolute flex size-full items-center justify-center">
        <span className={cn("text-[#A7A7A7] lg:text-black", offset[shape])}>{t("general.empty")}</span>
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
