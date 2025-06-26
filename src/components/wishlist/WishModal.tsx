import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { WishForm } from "~/components/wishlist/own/WishForm";
import * as React from "react";
import { cn } from "~/utils/classnames";
import { WishType } from "~/services/wishlist/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { WishCard } from "~/components/wishlist/WishCard";
import { Scrollable } from "~/components/ui/scrollable";
import { DesktopOnly } from "~/components/MediaComponents";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export function WishModal({
  isOpen,
  onOpenChange,
  isLoggedIn,
  firstWish,
  wish,
  ...props
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  wish?: WishType;
  reservedByCurrentUser?: boolean;
  showReserved?: boolean;
  username: string;
  isForeign?: boolean;
  isLoggedIn?: boolean;
  firstWish?: boolean;
  withOwnerUsername?: boolean;
}) {
  const [editMode, setEditMode] = useState(!wish);
  const { t } = useTranslation();

  let content;

  if (editMode || !wish) {
    content = (
      <WishForm
        {...props}
        wish={wish}
        onActionSuccess={() => {
          setEditMode(false);
          if (!wish) {
            onOpenChange(false);
          }
        }}
        onBack={() => {
          setEditMode(false);
          if (!wish) {
            onOpenChange(false);
          }
        }}
        firstWish={firstWish}
      />
    );
  } else {
    content = (
      <Scrollable
        className="mx-auto max-w-lg rounded-b bg-muted"
        footer={
          <Button onClick={() => onOpenChange(false)} variant="outline" size="lg" className="mt-auto">
            {t("actions.back")}
          </Button>
        }
      >
        <div className="mx-auto w-full max-w-lg pb-4">
          <WishCard {...props} wish={wish} onEnableEditMode={() => setEditMode(true)} isLoggedIn={isLoggedIn} />
        </div>
      </Scrollable>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => onOpenChange(open)}>
      <DialogContent className={cn(firstWish ? "h-dvh" : "h-[calc(100dvh-5rem)]")}>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Add new wish</DialogTitle>
            <DialogDescription>You can add a new wish here</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        {content}
      </DialogContent>
    </Dialog>
  );
}

const Dialog = DialogPrimitive.Root;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-white/70",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DesktopOnly>
      <DialogOverlay />
    </DesktopOnly>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] lg:w-[calc(100%_-_2rem) fixed left-0 top-0 z-50 block w-full overflow-y-auto bg-background duration-200 lg:left-[50%] lg:top-[50%] lg:h-fit lg:max-w-lg lg:translate-x-[-50%] lg:translate-y-[-50%] lg:rounded-md lg:border lg:p-6 lg:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DesktopOnly>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Cross2Icon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DesktopOnly>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("mt-6 text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
