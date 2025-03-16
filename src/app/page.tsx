import { SignInForm } from "~/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { SignInLayout } from "~/components/layout/Layout";
import { getSessionUser } from "~/services/session";
import { OnboardingWizard } from "~/components/forms/OnboardingWizard/OnboardingWizard";

export default async function Home() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <SignInLayout>
        <SignInForm />
      </SignInLayout>
    );
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    return <OnboardingWizard initialUsername={sessionUser.username} />;
  }

  redirect(`/${sessionUser.username}`);
}
