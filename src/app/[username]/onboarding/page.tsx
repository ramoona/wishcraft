import { getSessionUser } from "~/services/session";
import { redirect } from "next/navigation";
import { OnboardingLayout } from "~/components/layout/Layout";
import { OnboardingWizard } from "~/components/forms/OnboardingWizard/OnboardingWizard";

export default async function OnboardingPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect(`/`);
  }

  if (sessionUser && !sessionUser.isOnboarded) {
    return (
      <OnboardingLayout>
        <OnboardingWizard username={sessionUser.username} />
      </OnboardingLayout>
    );
  }

  redirect(`/${sessionUser.username}`);
}
