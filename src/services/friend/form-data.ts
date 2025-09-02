import { TypedFormData } from "~/lib/form-data/typed-form-data";
import { z } from "zod";

export const FriendFormData = new TypedFormData(
  z.object({
    friendId: z.string().min(1),
  }),
);
