import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/classnames";

const buttonVariants = cva(
  "inline-flex w-fit min-w-[214px] items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary: "bg-[#D9D9D9] text-primary-foreground hover:bg-[#d9d9d9c9]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
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
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
  ({ className, variant, size, type = "button", fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className, fullWidth }))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
