import { useTranslation } from "react-i18next";

export function Price({
  price,
  currency,
  size = "default",
}: {
  price: number | null;
  currency: string | null;
  size?: "default" | "large";
}) {
  const { i18n } = useTranslation();

  if (!price || !currency) {
    return null;
  }

  return (
    <span
      className={
        size === "large"
          ? "shrink-0 font-bold lg:ml-auto lg:rounded lg:bg-background/50 lg:px-1 lg:py-0.5 lg:text-sm lg:font-medium lg:text-foreground/60"
          : "shrink-0 text-sm font-medium lg:pl-2 lg:text-foreground/60"
      }
    >
      {price.toLocaleString(i18n.language || "de", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      })}
    </span>
  );
}
