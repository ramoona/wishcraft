export type OnboardingStepType =
  | "username"
  | "date-of-birth"
  | "reserved-wishes-visibility"
  | "default-currency"
  | "profile-visibility"
  | "first-wish";

export type OnboardingStepInput =
  | UsernameInput
  | DateOfBirthInput
  | ReservedWishesVisibilityInput
  | DefaultCurrencyInput
  | ProfileVisibilityInput
  | FirstWishInput;

type UsernameInput = {
  type: "username";
  username: string;
};

type DateOfBirthInput = {
  type: "date-of-birth";
  dayOfBirth: number;
  monthOfBirth: number;
};

type ReservedWishesVisibilityInput = {
  type: "reserved-wishes-visibility";
  showReserved: boolean;
};

type DefaultCurrencyInput = {
  type: "default-currency";
  currency: string;
};

type ProfileVisibilityInput = {
  type: "profile-visibility";
  isProfileHidden: boolean;
};

type FirstWishInput = {
  type: "first-wish";
};

export function isUsernameInput(input: OnboardingStepInput): input is UsernameInput {
  return input.type === "username";
}

export function isDateOfBirthInput(input: OnboardingStepInput): input is DateOfBirthInput {
  return input.type === "date-of-birth";
}

export function isReservedWishesVisibilityInput(input: OnboardingStepInput): input is ReservedWishesVisibilityInput {
  return input.type === "reserved-wishes-visibility";
}

export function isDefaultCurrencyInput(input: OnboardingStepInput): input is DefaultCurrencyInput {
  return input.type === "default-currency";
}

export function isProfileVisibilityInput(input: OnboardingStepInput): input is ProfileVisibilityInput {
  return input.type === "profile-visibility";
}
