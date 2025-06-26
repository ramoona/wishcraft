import { getSessionUser } from "~/services/session";
import { redirect } from "next/navigation";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  redirect(`/${sessionUser.username}/friends/your-friends`);
}
