"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/classnames";
import { PropsWithChildren } from "react";
import { WarningCircle, UserCircleDashed } from "@phosphor-icons/react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export function ErrorAlert({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-fit">
        <Alert variant="destructive">
          <AlertTitle className="flex items-center gap-2">
            <WarningCircle className="size-5" /> {title || "Error"}
          </AlertTitle>
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export function UserNotFoundAlert({ username }: { username: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-fit">
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <UserCircleDashed className="size-5" /> User Not Found
          </AlertTitle>
          <AlertDescription>
            We could not find {username}&apos;s wishlist...Is there maybe a typo in your URL?
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export function SomethingWentWrongAlert({ error }: { error?: string }) {
  // eslint-disable-next-line no-console
  console.error(error);
  return (
    <ErrorAlert title="Error">
      Uh-oh, something went terribly wrong and to be honest, we have no clue what happened. <br />
      But we notified someone who can figure this out so please hold tight!
    </ErrorAlert>
  );
}

export { Alert, AlertTitle, AlertDescription };
