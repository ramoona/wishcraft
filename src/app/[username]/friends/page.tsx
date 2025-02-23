import { getSessionUser } from "~/services/auth";
import { getErrorMessage } from "~/core/toastMessages";
import { ErrorAlert } from "~/components/ui/alert";
import { isErrorKnown, KnownError } from "~/core/errors";
import { redirect } from "next/navigation";
import { getFriendsForCurrentUser } from "~/services/friend";
import { FriendsList } from "~/components/friends/FriendsList";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  try {
    const friends = await getFriendsForCurrentUser();
    return <FriendsList friends={friends} />;
  } catch (e) {
    return (
      <ErrorAlert>{getErrorMessage(isErrorKnown(e as Error) ? (e as KnownError).errorCode : "UNKNOWN")}</ErrorAlert>
    );
  }
}
