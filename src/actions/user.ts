"use server";

import { finalizeSignUp } from "prisma/handlers/user";
import { PrismaError } from "prisma/errors";
import { SignUpFormData } from "~/actions/formData";
import { getSessionUser } from "~/auth/getSessionUser";

type ActionState = { error?: string };

export const finalizeSignUpAction = async (formData: FormData): Promise<ActionState> => {
  const sessionUser = await getSessionUser();
  const username = SignUpFormData.toObject(formData).username;

  if (!username) {
    return { error: "Username is required" };
  }

  if (!sessionUser) {
    return { error: "Unauthorized" };
  }

  try {
    await finalizeSignUp({ userId: sessionUser.id, username });
    return { error: undefined };
  } catch (e) {
    return {
      error:
        e instanceof PrismaError && e.errorType === "USERNAME_IS_TAKEN" ? "Username is taken" : "Something went wrong",
    };
  }
};
