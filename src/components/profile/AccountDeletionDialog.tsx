import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { deleteUserAccountAction } from "~/services/user/actions";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/error-messages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export function AccountDeletionDialog({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const deleteAccount = () => {
    startTransition(async () => {
      const { error } = await deleteUserAccountAction();
      if (error) {
        if (error === "UNAUTHORIZED") {
          router.push("/");
        } else {
          showErrorToast(getErrorMessage(error, t));
        }
      } else {
        router.push("/");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("profile.deleteAccountModal.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("profile.deleteAccountModal.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={deleteAccount} variant="destructive">
            {t("profile.deleteAccountModal.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
