export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string | null;
  dateOfBirth: string | null;
  defaultCurrency?: string | null;
  showReserved?: boolean | null;
};

export type OtherUser = Pick<User, "id" | "username" | "firstName" | "lastName" | "dateOfBirth" | "image"> & {
  isFriend: boolean;
};
