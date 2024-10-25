"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import { PropsWithChildren } from "react";

export function Slider({ header, children, isOpen }: PropsWithChildren<{ header: string; isOpen: boolean }>) {
  return (
    <div
      className={twMerge(
        "fixed bottom-0 right-0 h-full w-screen translate-x-[100vw] transition-transform duration-300 ease-in-out md:w-[420px] md:translate-x-[420px] " +
          "z-10 mt-24 flex flex-col border-l border-l-slate-200 bg-white p-6",
        isOpen && "translate-x-0",
      )}
    >
      <div className="mb-4 font-medium">{header}</div>
      <div className="h-full flex-1">{children}</div>
    </div>
  );
}
