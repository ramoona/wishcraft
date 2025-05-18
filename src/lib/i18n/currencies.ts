import { TFunction } from "i18next";

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

const currencyTranslationMap: Record<string, string> = {
  USD: "currency.usd",
  EUR: "currency.eur",
  GBP: "currency.gbp",
  JPY: "currency.jpy",
  AUD: "currency.aud",
  CAD: "currency.cad",
  CHF: "currency.chf",
  CNY: "currency.cny",
  HKD: "currency.hkd",
  NZD: "currency.nzd",
  SEK: "currency.sek",
  KRW: "currency.krw",
  SGD: "currency.sgd",
  NOK: "currency.nok",
  MXN: "currency.mxn",
  INR: "currency.inr",
  RUB: "currency.rub",
  ZAR: "currency.zar",
  BRL: "currency.brl",
  TRY: "currency.try",
};

export function getTranslatedCurrency(currency: string, t: TFunction) {
  const translationKey = currencyTranslationMap[currency];
  return translationKey ? t(translationKey) : currency;
}
