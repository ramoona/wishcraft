import { getSessionUser } from "~/services/session";
import { redirect } from "next/navigation";

export default async function WishesPage({ params }: { params: Promise<{ username: string }> }) {
  const sessionUser = await getSessionUser();
  const { username } = await params;

  if (sessionUser && !sessionUser.isOnboarded) {
    redirect(`/${sessionUser.username}/onboarding`);
  }

  if (sessionUser && sessionUser.username === username) {
    redirect(`/${username}/wishes/active`);
  }

  redirect("/");
}
