import { getSessionUserOrThrow } from "~/services/session";
import { ErrorMessage } from "~/components/ErrorMessage";
import { OnboardingWizardUsernameStep } from "~/components/forms/OnboardingWizard/UsernameForm";
import { User, ONBOARDING_STEPS } from "~/services/user/types";
import { isErrorKnown, KnownError } from "~/core/errors";
import { OnboardingWizardDateOfBirthStep } from "~/components/forms/OnboardingWizard/DateOfBirthForm";
import { OnboardingWizardCurrencyStep } from "~/components/forms/OnboardingWizard/CurrencyForm";
import { OnboardingWizardReservedWishesVisibilityStep } from "~/components/forms/OnboardingWizard/ReservedWishesVisibilityForm";
import { OnboardingWizardProfileVisibilityStep } from "~/components/forms/OnboardingWizard/ProfileVisibilityForm";
import { OnboardingWizardFirstWishStep } from "~/components/forms/OnboardingWizard/FirstWish";

const wizardStepForm = {
  username: OnboardingWizardUsernameStep,
  ["date-of-birth"]: OnboardingWizardDateOfBirthStep,
  ["reserved-wishes-visibility"]: OnboardingWizardReservedWishesVisibilityStep,
  ["default-currency"]: OnboardingWizardCurrencyStep,
  ["profile-visibility"]: OnboardingWizardProfileVisibilityStep,
  ["first-wish"]: OnboardingWizardFirstWishStep,
};

export async function OnboardingWizard({ username }: { username: string }) {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const currentStep = getCurrentStep(sessionUser);

    if (!currentStep) {
      return <ErrorMessage errorCode="UNKNOWN" />;
    }

    const Component = wizardStepForm[currentStep];

    return <Component username={username} />;
  } catch (e) {
    return <ErrorMessage errorCode={isErrorKnown(e as Error) ? (e as KnownError).errorCode : undefined} />;
  }
}

function getCurrentStep(sessionUser: User) {
  const stepsToComplete = ONBOARDING_STEPS.filter(
    step => !(step === "reserved-wishes-visibility" && sessionUser.isProfileHidden),
  );
  return stepsToComplete.find(step => !sessionUser.completedOnboardingSteps.includes(step));
}
