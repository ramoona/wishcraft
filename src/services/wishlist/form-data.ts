import { TypedFormData } from "~/lib/form-data/typed-form-data";
import {
  WishCreationInputSchema,
  WishlistReservationInputSchema,
  WishUpdateInputSchema,
} from "~/services/wishlist/schemas";
import { z } from "zod";

export const WishlistReservationFormData = new TypedFormData(WishlistReservationInputSchema);
export const WishCreationFormData = new TypedFormData(WishCreationInputSchema);
export const WishUpdateFormData = new TypedFormData(WishUpdateInputSchema);
export const WishDeletionFormData = new TypedFormData(z.object({ id: z.string().min(1) }));
