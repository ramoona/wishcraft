"use server";

import { finalizeSignUp } from "~/services/user/index";
import { ServerError, ServerErrorCode } from "~/services/errors";
import { getSessionUserOrThrow } from "~/services/auth";
import { UserError, UserErrorCode } from "~/services/user/errors";
import { SignUpFormData } from "~/services/user/formData";

type ActionState = { error?: ServerErrorCode | UserErrorCode };

export const finalizeSignUpAction = async (formData: FormData): Promise<ActionState> => {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const username = SignUpFormData.toObject(formData).username;

    await finalizeSignUp({ userId: sessionUser.id, username });
    return { error: undefined };
  } catch (e) {
    return {
      error: getErrorCode(e),
    };
  }
};

function getErrorCode(e: unknown) {
  return e instanceof ServerError || e instanceof UserError ? e.errorCode : "UNKNOWN";
}
