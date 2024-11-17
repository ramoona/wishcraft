"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "~/components/ui/drawer";
import { WishForm } from "~/components/wishlist/own/WishForm";
import { WishType } from "~/services/wishlist/types";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import React, { PropsWithChildren, useEffect, useState } from "react";

export function WishDrawer({
  wish,
  mode,
  children,
}: PropsWithChildren<{
  wish?: WishType;
  mode: "update" | "create";
}>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, []);

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)} onOpenChange={open => setIsOpen(open)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="px-6 pb-4">
        <VisuallyHidden>
          <DrawerTitle>{mode === "update" ? "Update" : "Create"} your wish</DrawerTitle>
          <DrawerDescription>{mode === "update" ? "Update" : "Create"} your wish</DrawerDescription>
        </VisuallyHidden>
        <WishForm wish={wish} onCancel={() => setIsOpen(false)} onActionSuccess={() => setIsOpen(false)} />
        <VisuallyHidden>
          <DrawerClose>Close</DrawerClose>
        </VisuallyHidden>
      </DrawerContent>
    </Drawer>
  );
}
