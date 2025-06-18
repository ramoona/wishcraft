import { cn } from "~/utils/classnames";

export function DesktopOnly({
  children,
  className,
  display = "block",
}: {
  children: React.ReactNode;
  className?: string;
  display?: "flex" | "grid" | "block";
}) {
  return (
    <div
      className={cn(
        className,
        "hidden",
        display === "grid" && "lg:grid",
        display === "flex" && "lg:flex",
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
  display?: "flex" | "grid" | "block";
}) {
  return (
    <div
      className={cn(
        className,
        display === "grid" && "grid",
        display === "flex" && "flex",
        display === "block" && "block",
        "lg:hidden",
      )}
    >
      {children}
    </div>
  );
}
