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
    <span className={size === "large" ? "shrink-0 font-bold" : "shrink-0 text-sm font-medium"}>
      {price.toLocaleString(i18n.language || "de", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      })}
    </span>
  );
}
