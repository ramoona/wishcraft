"use server";

import { sendFriendRequest, removeFriend, acceptFriendRequest, declineFriendRequest } from "~/services/friend/index";
import { FriendFormData } from "~/services/friend/form-data";
import { getErrorCode, KnownError } from "~/core/errors";

type ActionState = { error?: KnownError["errorCode"] };

export const sendFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const friendId = FriendFormData.toObject(formData).friendId;

    await sendFriendRequest(friendId);
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const acceptFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const friendId = FriendFormData.toObject(formData).friendId;

    await acceptFriendRequest(friendId);
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const declineFriendRequestAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const friendId = FriendFormData.toObject(formData).friendId;

    await declineFriendRequest(friendId);
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

export const removeFriendAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const friendId = FriendFormData.toObject(formData).friendId;

    await removeFriend(friendId);
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};
