import { User } from "~/services/user/types";

export type FriendRequest = {
  id: string;
  requestedBy: User;
  receivedBy: User;
  createdAt: Date;
};
