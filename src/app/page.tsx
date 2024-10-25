import { SignInForm } from "~/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { SignInLayout } from "~/components/layout/Layout";
import { getSessionUser } from "~/services/auth";

export default async function Home() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <SignInLayout>
        <SignInForm />
      </SignInLayout>
    );
  }

  redirect(`/${sessionUser.username}`);
}
