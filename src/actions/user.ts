import { updateUsername } from "prisma/handlers/user";
import { PrismaError } from "prisma/errors";

export type UsernameFormState = { username?: string; success?: boolean; error?: string };

export const setUsernameFormAction =
  (userId: string) =>
  async (_currentState: UsernameFormState, formData: FormData): Promise<UsernameFormState> => {
    "use server";

    const username = formData.get("username");

    if (!username) {
      return { error: "Username is required" };
    }

    try {
      await updateUsername({ username: username as string, userId });
      return { success: true, username: username as string };
    } catch (e) {
      return {
        error:
          e instanceof PrismaError && e.errorType === "USERNAME_IS_TAKEN"
            ? "Username is taken"
            : "Something went wrong",
      };
    }
  };
