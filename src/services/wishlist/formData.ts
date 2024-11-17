import { WishCreateInput, WishType, WishUpdateInput } from "~/services/wishlist/types";
import { TypedFormData } from "~/utils/formData";

export const WishlistReservationFormData = new TypedFormData<{ wishId: string }>();
export const WishCreationFormData = new TypedFormData<WishCreateInput>();
export const WishUpdateFormData = new TypedFormData<WishUpdateInput>();
export const WishDeletionFormData = new TypedFormData<Pick<WishType, "id">>();
