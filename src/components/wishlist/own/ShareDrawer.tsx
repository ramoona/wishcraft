"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "~/components/ui/drawer";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import React, { useEffect, useRef, useState } from "react";
import { CheckFat, ClipboardText, ShareFat } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function ShareDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  const link = typeof window !== "undefined" ? location.href.split("?")[0] : "";

  const copyLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setCopied(false);
      }, 3000) as unknown as number;
    }
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)} onOpenChange={open => setIsOpen(open)}>
      <DrawerTrigger asChild>
        <Button size="lg" fullWidth>
          <div className="flex items-center justify-center gap-2">
            <ShareFat size={24} />
            Share
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pb-4">
        <VisuallyHidden>
          <DrawerTitle>Share your wishlist</DrawerTitle>
          <DrawerDescription>Share your wishlist</DrawerDescription>
        </VisuallyHidden>
        <div className="min-h-64 p-4">
          <div>Share your wishlist</div>
          <Input disabled value={link} />
        </div>
        <Button size="lg" onClick={copyLink}>
          <div className="flex items-center justify-center gap-2">
            {copied ? <CheckFat size={24} /> : <ClipboardText size={24} />}
            {copied ? "Copied!" : "Copy Link"}
          </div>
        </Button>
        <VisuallyHidden>
          <DrawerClose>Close</DrawerClose>
        </VisuallyHidden>
      </DrawerContent>
    </Drawer>
  );
}
