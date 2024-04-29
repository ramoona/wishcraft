"use server";

import { finalizeSignUp } from "prisma/handlers/user";
import { PrismaError } from "prisma/errors";
import { getServerSession } from "~/auth/getServerSession";
import { SignUpFormData } from "~/actions/formData";

type ActionState = { error?: string };

export const finalizeSignUpFormAction = async (formData: FormData): Promise<ActionState> => {
  const session = await getServerSession();
  const username = SignUpFormData.toObject(formData).username;

  if (!username) {
    return { error: "Username is required" };
  }

  if (!session?.user.id) {
    return { error: "Unauthorized" };
  }

  try {
    await finalizeSignUp({ userId: session.user.id, username });
    return { error: undefined };
  } catch (e) {
    return {
      error:
        e instanceof PrismaError && e.errorType === "USERNAME_IS_TAKEN" ? "Username is taken" : "Something went wrong",
    };
  }
};
