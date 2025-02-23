import { getSessionUser } from "~/services/auth";
import { redirect } from "next/navigation";
import { Profile } from "~/components/user/Profile";

export default async function FriendsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/");
  }

  return <Profile user={sessionUser} />;
}
