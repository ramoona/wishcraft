import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/classnames";
import { omit } from "ramda";

const buttonVariants = cva(
  "inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-primary/30 hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary: "bg-[#D9D9D9] text-primary-foreground hover:bg-[#d9d9d9c9]",
        ghost: "hover:bg-primary/30 hover:text-primary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        xs: "h-6 px-3 text-xs",
        lg: "h-10 px-8",
        fit: "h-fit",
        icon: "size-8",
      },
      fullWidth: {
        true: "w-full",
      },
      minWidth: {
        true: "min-w-[214px]",
        false: "min-w-min",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      minWidth: true,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", fullWidth, minWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className, fullWidth, minWidth }))}
        ref={ref}
        type={type}
        {...omit(["isLoading"], props)}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
