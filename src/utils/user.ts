import { User } from "~/services/user/types";

export function getDaysUntilBirthday(user: Pick<User, "dayOfBirth" | "monthOfBirth">): null | number {
  const { dayOfBirth, monthOfBirth } = user;

  if (!dayOfBirth || !monthOfBirth) {
    return null;
  }

  const now = new Date();
  const birthday = new Date(new Date().getFullYear(), monthOfBirth - 1, dayOfBirth, 0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const daysUntilBirthday = Math.max(0, Math.floor((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return daysUntilBirthday || null;
}
