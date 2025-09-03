import { getSessionUserOrThrow } from "~/services/session";
import { prisma } from "prisma/db";
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
  isProfileHidden: true,
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

export async function getFriendRequestsForCurrentUser(): Promise<FriendUser[]> {
  const sessionUser = await getSessionUserOrThrow();

  const requests = await prisma.friendRequest.findMany({
    where: { receivedById: sessionUser.id },
    include: { requestedBy: { select: FRIEND_FIELDS_SELECT } },
  });

  return requests.map(({ requestedBy }) => toFriend(requestedBy));
}

export async function countFriendRequestsForCurrentUser(): Promise<number> {
  const sessionUser = await getSessionUserOrThrow();

  return prisma.friendRequest.count({
    where: { receivedById: sessionUser.id },
  });
}

export async function sendFriendRequest(friendId: string) {
  const sessionUser = await getSessionUserOrThrow();
  await prisma.friendRequest.create({
    data: {
      requestedById: sessionUser.id,
      receivedById: friendId,
    },
  });
  await logUserAction({ action: "friend-request-sent", friendId });
}

export async function acceptFriendRequest(friendId: string) {
  const sessionUser = await getSessionUserOrThrow();
  await prisma.$transaction(async client => {
    await client.friend.create({
      data: {
        friendAId: sessionUser.id,
        friendBId: friendId,
      },
    });
    await client.friendRequest.delete({
      where: {
        requestedById_receivedById: {
          requestedById: friendId,
          receivedById: sessionUser.id,
        },
      },
    });
  });
  await logUserAction({ action: "friend-request-accepted", friendId });
}

export async function declineFriendRequest(friendId: string) {
  const sessionUser = await getSessionUserOrThrow();
  await prisma.friendRequest.delete({
    where: {
      requestedById_receivedById: {
        requestedById: friendId,
        receivedById: sessionUser.id,
      },
    },
  });
  await logUserAction({ action: "friend-request-dismissed", friendId });
}

export async function removeFriend(friendId: string) {
  const sessionUser = await getSessionUserOrThrow();
  await prisma.friend.deleteMany({
    where: {
      OR: [
        { friendAId: sessionUser.id, friendBId: friendId },
        { friendAId: friendId, friendBId: sessionUser.id },
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
    recentWishes: user.isProfileHidden ? [] : user.wishlists[0].wishes.map(wish => ({ name: wish.name, id: wish.id })),
  };
}
