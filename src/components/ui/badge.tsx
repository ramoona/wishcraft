import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/classnames";

const badgeVariants = cva("inline-flex h-6 min-w-[70px] items-center rounded-full px-2.5 py-0.5 text-center text-xs", {
  variants: {
    variant: {
      default: "bg-[#FFEFB3] text-primary-foreground hover:bg-[#FFEFB3CD]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      attention: "bg-purple-100 text-purple-800",
      destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
      outline: "bg-background text-foreground",
      reserved: "bg-secondary text-[#FFEFB3] hover:bg-secondary/80",
      reservedByYou: "bg-secondary text-primary hover:bg-secondary/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
