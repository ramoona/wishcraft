"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";

import { TypographyHeader } from "~/components/ui/typography";
import { WishOverlay } from "~/components/wishlist/WishOverlay";

export function OnboardingWizardFirstWishStep({ username }: { username: string }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch(`${username}/wishes`);
  }, [router, username]);

  return isFormOpen ? (
    <WishOverlay
      isLoggedIn
      firstWish
      onBack={() => {
        setIsFormOpen(false);
      }}
    />
  ) : (
    <OnboardingWizardStep
      title={t("onboarding.fistWish.title")}
      step="first-wish"
      onSubmit={() => setIsFormOpen(true)}
      isSubmitting={false}
      isSkippable
    >
      <TypographyHeader>{t("onboarding.fistWish.subTitle")}</TypographyHeader>
    </OnboardingWizardStep>
  );
}
