import { showErrorToast, showSuccessToast } from "~/components/ui/toasts";
import { getErrorMessage, getSuccessMessage, SuccessMessageCode } from "~/core/toastMessages";
import { ServerErrorCode } from "~/services/errors";
import { UserErrorCode } from "~/services/user/errors";
import { WishlistErrorCode } from "~/services/wishlist/errors";

export function showToastWithActionResult(
  success: SuccessMessageCode,
  error?: ServerErrorCode | UserErrorCode | WishlistErrorCode,
) {
  if (error) {
    showErrorToast(getErrorMessage(error));
  } else {
    showSuccessToast(getSuccessMessage(success));
  }
}
