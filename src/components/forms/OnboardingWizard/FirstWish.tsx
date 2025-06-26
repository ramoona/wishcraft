"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { OnboardingWizardStep } from "~/components/forms/OnboardingWizard/StepForm";

import { TypographyH2 } from "~/components/ui/typography";
import { WishModal } from "~/components/wishlist/WishModal";

export function OnboardingWizardFirstWishStep({ username }: { username: string }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch(`${username}/wishes`);
  }, [router, username]);

  return (
    <>
      <OnboardingWizardStep
        title={t("onboarding.fistWish.title")}
        step="first-wish"
        onSubmit={() => setIsFormOpen(true)}
        isSubmitting={false}
        isSkippable
      >
        <div className="flex h-full flex-col items-center pb-4 lg:w-full">
          <TypographyH2 className="-mt-4">{t("onboarding.fistWish.subTitle")}</TypographyH2>
          <div
            className="aspect-[0.94] w-full grow sm:mt-10 sm:w-[306px] sm:grow-0 sm:p-0 lg:mt-0 lg:w-[200px] lg:scale-[1.4]"
            style={{
              backgroundImage: "url('/images/art-3.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </OnboardingWizardStep>
      <WishModal username={username} isOpen={isFormOpen} onOpenChange={setIsFormOpen} firstWish />
    </>
  );
}
