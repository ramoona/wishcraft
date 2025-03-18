export function Price({ price, currency }: { price: number | null; currency: string | null }) {
  if (!price || !currency) {
    return null;
  }

  return (
    <span className="text-sm font-medium">
      {price.toLocaleString("de-DE", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      })}
    </span>
  );
}
