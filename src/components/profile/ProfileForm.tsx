import { User } from "~/services/user/types";
import { DesktopOnly } from "~/components/MediaComponents";
import { UserDetails } from "~/components/ui/user";
import React from "react";
import { ProfileVisibilityForm } from "~/components/profile/ProfileVisibilityForm";
import { ReservedWishesVisibilityForm } from "~/components/profile/ReservedWishesVisibilityForm";
import { DefaultCurrencyForm } from "~/components/profile/DefaultCurrencyForm";
import { DateOfBirthForm } from "~/components/profile/DateOfBirthForm";
import { PreferredLanguageForm } from "~/components/profile/PreferredLanguageForm";

export function ProfileForm({ user }: { user: User }) {
  return (
    <div className="mx-auto max-w-lg bg-background px-4 lg:mx-0 lg:mt-4 lg:max-w-xl lg:rounded-xl lg:border lg:p-5">
      <DesktopOnly className="mb-8">
        <UserDetails user={user} email={user.email} context="profile-desktop" />
      </DesktopOnly>
      <form className="flex flex-col gap-4" autoComplete="off">
        <div className="flex flex-col gap-6">
          <DateOfBirthForm day={user.dayOfBirth ?? undefined} month={user.monthOfBirth ?? undefined} />
          <div className="grid w-full grid-cols-2 gap-4">
            <DefaultCurrencyForm currency={user.defaultCurrency ?? ""} />
            <PreferredLanguageForm />
          </div>
          <ProfileVisibilityForm isProfileHidden={user.isProfileHidden} />
          <ReservedWishesVisibilityForm showReserved={user.showReserved ?? false} />
        </div>
      </form>
    </div>
  );
}
