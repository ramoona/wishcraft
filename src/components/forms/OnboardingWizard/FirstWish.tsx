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
      <div className="flex h-full flex-col items-center pb-4">
        <TypographyHeader>{t("onboarding.fistWish.subTitle")}</TypographyHeader>
        <div
          className="w-full grow sm:mt-10 sm:h-[284px] sm:w-[306px] sm:grow-0 sm:p-0"
          style={{
            backgroundImage: "url('/images/art-3.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </OnboardingWizardStep>
  );
}
