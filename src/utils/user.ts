import { User } from "~/services/user/types";

export function getDaysUntilBirthday(user: Pick<User, "dayOfBirth" | "monthOfBirth">): null | number {
  const { dayOfBirth, monthOfBirth } = user;

  if (!dayOfBirth || !monthOfBirth) {
    return null;
  }

  const now = new Date(Date.now());
  const currentYear = now.getFullYear();

  // Create this year's birthday
  let birthdayThisYear = new Date(currentYear, monthOfBirth - 1, dayOfBirth);

  // If birthday has already passed this year, calculate for next year
  if (birthdayThisYear < now) {
    birthdayThisYear = new Date(currentYear + 1, monthOfBirth - 1, dayOfBirth);
  }

  // Set both dates to midnight for accurate day calculation
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthday = new Date(birthdayThisYear.getFullYear(), birthdayThisYear.getMonth(), birthdayThisYear.getDate());

  // Calculate difference in milliseconds and convert to days
  const timeDiff = birthday.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}
