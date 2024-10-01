import { SignInForm } from "~/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { SetUpUsernameForm } from "~/components/forms/SetUpUsernameForm";
import { Layout } from "~/components/layout/Layout";
import { getSessionUser } from "~/auth/getSessionUser";

export default async function Home() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <Layout>
        Log In
        <SignInForm />
      </Layout>
    );
  }

  if (!sessionUser.username) {
    return (
      <Layout>
        Welcome, {sessionUser.name}! Choose a username to continue:
        <SetUpUsernameForm />
      </Layout>
    );
  }

  redirect(`/${sessionUser.username}`);
}
