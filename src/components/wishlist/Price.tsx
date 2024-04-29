import { Currency } from "@prisma/client";

export function Price({ price, currency }: { price: number | null; currency: Currency | null }) {
  if (!price || !currency) {
    return null;
  }

  return (
    <span className="text-sm text-slate-500">
      {price.toLocaleString(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
      })}{" "}
    </span>
  );
}
