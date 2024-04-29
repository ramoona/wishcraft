"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function Slider({
  triggerText,
  header,
  children,
}: {
  triggerText: string;
  header?: string;
  children: (props: { onClose(): void }) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{triggerText}</Button>
      <div
        className={twMerge(
          "fixed bottom-0 right-0 h-full w-[420px] translate-x-[420px] transition-transform duration-300 ease-in-out  " +
            "mt-24 flex flex-col border-l border-l-slate-200 p-6",
          isOpen && "translate-x-0",
        )}
      >
        <div className="mb-4 font-medium">{header}</div>
        <div className="h-full flex-1">{children({ onClose: () => setIsOpen(false) })}</div>
      </div>
    </div>
  );
}
