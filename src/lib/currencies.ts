export const currencies = [
  "USD", // US Dollar
  "EUR", // Euro
  "GBP", // British Pound
  "JPY", // Japanese Yen
  "AUD", // Australian Dollar
  "CAD", // Canadian Dollar
  "CHF", // Swiss Franc
  "CNY", // Chinese Yuan
  "HKD", // Hong Kong Dollar
  "NZD", // New Zealand Dollar
  "SEK", // Swedish Krona
  "KRW", // South Korean Won
  "SGD", // Singapore Dollar
  "NOK", // Norwegian Krone
  "MXN", // Mexican Peso
  "INR", // Indian Rupee
  "RUB", // Russian Ruble
  "ZAR", // South African Rand
  "BRL", // Brazilian Real
  "TRY", // Turkish Lira
] as const;

export const currencyNames: Record<(typeof currencies)[number], string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar",
  SEK: "Swedish Krona",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  NOK: "Norwegian Krone",
  MXN: "Mexican Peso",
  INR: "Indian Rupee",
  RUB: "Russian Ruble",
  ZAR: "South African Rand",
  BRL: "Brazilian Real",
  TRY: "Turkish Lira",
};
