"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import useMasonry from "~/hooks/useMasonry";
import { WishType } from "~/services/wishlist/types";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { cn } from "~/utils/classnames";

export function WishlistItems({ children, wishes = [] }: PropsWithChildren<{ wishes?: WishType[] }>) {
  return (
    <>
      <DesktopOnly>
        <WishlistItemsDesktop wishes={wishes}>{children}</WishlistItemsDesktop>
      </DesktopOnly>
      <MobileOnly>
        <WishlistItemsMobile>{children}</WishlistItemsMobile>
      </MobileOnly>
    </>
  );
}

function WishlistItemsDesktop({ children, wishes = [] }: PropsWithChildren<{ wishes?: WishType[] }>) {
  const [mounted, setMounted] = useState(false);
  const { initialized, container } = useMasonry(wishes);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  return (
    <div
      className={cn(
        "flex flex-col flex-wrap items-start gap-x-8 gap-y-3 opacity-0 lg:grid lg:grid-cols-2 xl:grid-cols-3",
        initialized && "opacity-100 transition-opacity duration-500",
      )}
      ref={container}
    >
      {children}
    </div>
  );
}

function WishlistItemsMobile({ children }: PropsWithChildren) {
  return <div className="flex flex-col flex-wrap items-start gap-5">{children}</div>;
}
