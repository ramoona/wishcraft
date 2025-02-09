import { getSessionUserOrThrow } from "~/services/auth";
import { prisma } from "prisma/client";
import { User as PrismaUser } from "@prisma/client";
import { OtherUser } from "~/services/user/types";
import { logUserAction } from "~/services/user";

const FRIEND_FIELDS_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  dateOfBirth: true,
};

export async function getFriendsForCurrentUser(): Promise<OtherUser[]> {
  const sessionUser = await getSessionUserOrThrow();

  const friends = await prisma.friend.findMany({
    where: { OR: [{ friendAId: sessionUser.id }, { friendBId: sessionUser.id }] },
    include: {
      friendA: { select: FRIEND_FIELDS_SELECT },
      friendB: { select: FRIEND_FIELDS_SELECT },
    },
  });

  return friends.map(friend => {
    return friend.friendAId === sessionUser.id ? toFriend(friend.friendB) : toFriend(friend.friendA);
  });
}

export async function addFriend({ userId, friendId }: { userId: string; friendId: string }) {
  await prisma.friend.create({
    data: {
      friendAId: userId,
      friendBId: friendId,
    },
  });
  await logUserAction({ action: "friend-added", friendId });
}

export async function removeFriend({ userId, friendId }: { userId: string; friendId: string }) {
  await prisma.friend.deleteMany({
    where: {
      OR: [
        { friendAId: userId, friendBId: friendId },
        { friendAId: friendId, friendBId: userId },
      ],
    },
  });
  await logUserAction({ action: "friend-removed", friendId });
}

function toFriend(user: Pick<PrismaUser, keyof typeof FRIEND_FIELDS_SELECT>): OtherUser {
  return { ...user, dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || null, isFriend: true };
}
