import { cn } from "~/utils/classnames";

export function DesktopOnly({
  children,
  className,
  display = "block",
}: {
  children: React.ReactNode;
  className?: string;
  display?: "flex" | "grid" | "block" | "inline";
}) {
  return (
    <div
      className={cn(
        className,
        "hidden",
        display === "grid" && "lg:grid",
        display === "flex" && "lg:flex",
        display === "inline" && "lg:inline",
        display === "block" && "lg:block",
      )}
    >
      {children}
    </div>
  );
}

export function MobileOnly({
  children,
  className,
  display = "block",
}: {
  children: React.ReactNode;
  className?: string;
  display?: "flex" | "grid" | "block" | "inline";
}) {
  return (
    <div
      className={cn(
        className,
        display === "grid" && "grid",
        display === "flex" && "flex",
        display === "block" && "block",
        display === "inline" && "inline",
        "lg:hidden",
      )}
    >
      {children}
    </div>
  );
}
