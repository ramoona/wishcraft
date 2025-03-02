import { SignInForm } from "~/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { SignInLayout } from "~/components/layout/Layout";
import { getSessionUser } from "~/services/session";
import { isUserOnboarded } from "~/services/user";
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
    return <OnboardingWizard initialUsername={sessionUser.username} />;
  }

  if (!sessionUser.username) {
    return <SomethingWentWrongAlert />;
  }

  redirect(`/${sessionUser.username}`);
}
