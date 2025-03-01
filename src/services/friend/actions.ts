"use server";

import { addFriend, removeFriend } from "~/services/friend/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/session";
import { FriendFormData } from "~/services/friend/formData";

type ActionState = { error?: ServerErrorCode };

export const addFriendAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const friendId = FriendFormData.toObject(formData).friendId;

    await addFriend({ userId: sessionUser.id, friendId });
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
