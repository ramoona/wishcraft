"use server";

import { sendFriendRequest, removeFriend, acceptFriendRequest, declineFriendRequest } from "~/services/friend/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { FriendFormData } from "~/services/friend/form-data";

type ActionState = { error?: ServerErrorCode };

export const sendFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const friendId = FriendFormData.toObject(formData).friendId;

    await sendFriendRequest({ userId: sessionUser.id, friendId });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const acceptFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const friendId = FriendFormData.toObject(formData).friendId;

    await acceptFriendRequest({ userId: sessionUser.id, friendId });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const declineFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const friendId = FriendFormData.toObject(formData).friendId;

    await declineFriendRequest({ userId: sessionUser.id, friendId });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const removeFriendAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const friendId = FriendFormData.toObject(formData).friendId;

    await removeFriend({ userId: sessionUser.id, friendId });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError ? e.errorCode : "UNKNOWN";
}
