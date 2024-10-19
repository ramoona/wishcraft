import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/toastMessages";
import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";

export function showToastWithActionResult(error?: ServerErrorCode | UserErrorCode | WishlistErrorCode) {
  if (error) {
    showErrorToast(getErrorMessage(error));
  }
}
