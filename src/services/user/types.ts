export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string | null;
  dateOfBirth: string | null;
  defaultCurrency: string | null;
  showReserved: boolean | null;
};
