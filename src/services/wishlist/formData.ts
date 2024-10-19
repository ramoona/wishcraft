import { WishT } from "~/services/wishlist/types";
import { TypedFormData } from "~/utils/formData";

export const WishlistReservationFormData = new TypedFormData<{ wishId: string }>();
export const WishCreationFormData = new TypedFormData<Pick<WishT, "name" | "price" | "currency" | "url" | "comment">>();
export const WishUpdateFormData = new TypedFormData<
  Partial<Pick<WishT, "id" | "name" | "price" | "currency" | "url" | "comment" | "status">>
>();
export const WishDeletionFormData = new TypedFormData<Pick<WishT, "id">>();
