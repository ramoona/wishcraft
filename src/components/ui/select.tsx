"use client";

import * as React from "react";
import { cn } from "~/utils/classnames";

export type SelectOption = { value: string; label: string };

export function Select({
  options,
  onChange,
  value,
  placeholder,
  disabled,
  contentWidth,
  ...props
}: {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  contentWidth?: boolean;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">) {
  return (
    <select
      onChange={e => onChange(e.target.value)}
      value={value}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background",
        "px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        contentWidth ? "w-fit" : "w-full",
      )}
      {...props}
    >
      <option value="" disabled aria-labelledby={placeholder}>
        {placeholder}
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value} aria-labelledby={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
