import { PropsWithChildren } from "react";
import { OtherUser, User } from "~/services/user/types";

import { Logo } from "~/components/ui/logo";
import Link from "next/link";
import NavBar from "~/components/layout/NavBar";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { LogoLink } from "~/components/layout/LogoLink";

export function AuthenticatedLayout({
  user,
  children,
  otherUser,
}: PropsWithChildren<{ user: User; otherUser?: OtherUser }>) {
  return (
    <div className="relative grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="sticky top-0 flex h-20 w-screen items-center justify-center bg-background px-4">
        <LogoLink />
      </header>
      <main className="relative mx-auto grid w-full max-w-lg grid-rows-[auto_min-content] overflow-y-auto bg-muted sm:rounded">
        {children}
      </main>
      {user.isOnboarded && <NavBar user={user} otherUser={otherUser} />}
    </div>
  );
}

export function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="relative h-20 w-screen bg-background">
        <div className="mx-auto flex h-full max-w-lg items-center justify-between px-4">
          <Link href="/" className="h-fit">
            <Logo />
          </Link>
          <LanguageSwitcher contentWidth />
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-lg bg-muted sm:mb-4 sm:rounded">{children}</main>
    </div>
  );
}

export function SignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-primary">
      <header className="fixed left-0 top-0 z-10 flex w-screen items-center justify-center gap-4 p-8">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
      </header>
      <main className="relative min-h-screen overflow-auto px-4 pt-20">
        <div className="flex w-screen justify-center">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="relative h-20 w-screen bg-background">
        <div className="mx-auto flex h-full max-w-lg items-center justify-between px-4">
          <Link href="/" className="h-fit">
            <Logo />
          </Link>
          <LanguageSwitcher contentWidth />
        </div>
      </header>
      <main className="relative">{children}</main>
    </div>
  );
}
