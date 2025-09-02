import { getSessionUser } from "~/services/session";
import { redirect } from "next/navigation";
import { Profile } from "~/components/profile/Profile";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  return <Profile user={sessionUser} />;
}
