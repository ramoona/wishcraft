import { TFunction } from "i18next";

const translationMap: Record<number, string> = {
  1: "months.january",
  2: "months.february",
  3: "months.march",
  4: "months.april",
  5: "months.may",
  6: "months.june",
  7: "months.july",
  8: "months.august",
  9: "months.september",
  10: "months.october",
  11: "months.november",
  12: "months.december",
};

export function getTranslatedMonth(month: number, t: TFunction) {
  const translationKey = translationMap[month];
  return translationKey ? t(translationKey) : "";
}
