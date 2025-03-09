import { getSessionUserOrThrow } from "~/services/session";
import { ErrorAlert } from "~/components/ui/alert";
import { OnboardingWizardUsernameStep } from "~/components/forms/OnboardingWizard/UsernameForm";
import { User, userOnboardingSteps } from "~/services/user/types";
import { getErrorMessage } from "~/core/toastMessages";
import { isErrorKnown, KnownError } from "~/core/errors";
import { OnboardingWizardDateOfBirthStep } from "~/components/forms/OnboardingWizard/DateOfBirthForm";
import { OnboardingWizardCurrencyStep } from "~/components/forms/OnboardingWizard/CurrencyForm";
import { OnboardingWizardReservedWishesVisibilityStep } from "~/components/forms/OnboardingWizard/ReservedWishesVisibilityForm";
import { OnboardingWizardProfileVisibilityStep } from "~/components/forms/OnboardingWizard/ProfileVisibilityForm";

const wizardStepForm = {
  username: OnboardingWizardUsernameStep,
  ["date-of-birth"]: OnboardingWizardDateOfBirthStep,
  ["reserved-wishes-visibility"]: OnboardingWizardReservedWishesVisibilityStep,
  ["default-currency"]: OnboardingWizardCurrencyStep,
  ["profile-visibility"]: OnboardingWizardProfileVisibilityStep,
};

export async function OnboardingWizard({ initialUsername }: { initialUsername: string }) {
  try {
    const sessionUser = await getSessionUserOrThrow();
    const currentStep = getCurrentStep(sessionUser);

    if (!currentStep) {
      return <ErrorAlert>{getErrorMessage("UNKNOWN")}</ErrorAlert>;
    }

    const Component = wizardStepForm[currentStep];

    return <Component initialUsername={initialUsername} />;
  } catch (e) {
    return (
      <ErrorAlert>{getErrorMessage(isErrorKnown(e as Error) ? (e as KnownError).errorCode : "UNKNOWN")}</ErrorAlert>
    );
  }
}

function getCurrentStep(sessionUser: User) {
  const stepsToComplete = userOnboardingSteps.filter(
    step => !(step === "reserved-wishes-visibility" && sessionUser.isProfileHidden),
  );
  return stepsToComplete.find(step => !sessionUser.completedOnboardingSteps.includes(step));
}
