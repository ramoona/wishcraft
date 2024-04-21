import { SignInForm } from "~/components/forms/SignInForm";
import { getServerSession } from "~/auth/getServerSession";
import { redirect } from "next/navigation";
import { SetUpUsernameForm } from "~/components/forms/SetUpUsernameForm";
import { Layout } from "~/components/layout/Layout";
import { setUsernameFormAction } from "~/actions/user";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return (
      <Layout>
        Log In
        <SignInForm />
      </Layout>
    );
  }

  if (!session.user.username) {
    return (
      <Layout>
        Welcome, {session.user.name}! Choose a username to continue:
        <SetUpUsernameForm action={setUsernameFormAction(session.user.id)} />
      </Layout>
    );
  }

  redirect(`/${session.user.username}`);
}
