import { SignInForm } from "~/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { SignInLayout } from "~/components/layout/Layout";
import { getSessionUser } from "~/services/auth";
import { getAvailableUsername, isUserOnboarded } from "~/services/user";
import { OnboardingWizard } from "~/components/forms/OnboardingWizard/OnboardingWizard";
import { SomethingWentWrongAlert } from "~/components/ui/alert";

export default async function Home() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <SignInLayout>
        <SignInForm />
      </SignInLayout>
    );
  }

  if (sessionUser && !isUserOnboarded(sessionUser)) {
    const username = await getAvailableUsername([sessionUser.firstName, sessionUser.lastName].join("-").toLowerCase());
    return <OnboardingWizard initialUsername={username} />;
  }

  if (!sessionUser.username) {
    return <SomethingWentWrongAlert />;
  }

  redirect(`/${sessionUser.username}`);
}
