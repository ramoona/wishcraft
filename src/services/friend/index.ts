import { getSessionUserOrThrow } from "~/services/session";
import { prisma } from "prisma/client";
import { FriendUser } from "~/services/user/types";
import { logUserAction } from "~/services/user";
import { WISH_FIELDS_SELECT } from "~/services/wishlist";
import { Prisma, WishStatus } from "@prisma/client";
import { DateTime } from "luxon";

const FRIEND_FIELDS_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  dayOfBirth: true,
  monthOfBirth: true,
  wishlists: {
    select: {
      wishes: {
        where: {
          isPrivate: false,
          status: "ACTIVE" as WishStatus,
          createdAt: {
            gte: DateTime.now().minus({ month: 1 }).toJSDate(),
          },
        },
        select: WISH_FIELDS_SELECT,
      },
    },
  },
};

export async function getFriendsForCurrentUser(): Promise<FriendUser[]> {
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

function toFriend(
  user: Prisma.UserGetPayload<{
    select: typeof FRIEND_FIELDS_SELECT;
  }>,
): FriendUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    image: user.image,
    dayOfBirth: user.dayOfBirth,
    monthOfBirth: user.monthOfBirth,
    recentWishes: user.wishlists[0].wishes.map(wish => ({ name: wish.name })),
  };
}
