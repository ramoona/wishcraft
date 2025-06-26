import { PropsWithChildren, ReactNode } from "react";
import { User } from "~/services/user/types";

import { TextOnlyLogo } from "~/components/ui/logo";
import Link from "next/link";
import NavBar from "~/components/layout/NavBar";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { Sidebar } from "~/components/layout/Sidebar";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { LogoLink } from "~/components/layout/LogoLink";
import * as React from "react";
import { SignInButton } from "~/components/forms/SignInForm";

export function AuthenticatedLayout({
  user,
  children,
  friendRequestsCount,
}: PropsWithChildren<{ user: User; friendRequestsCount: number }>) {
  return (
    <div className="relative grid h-dvh grid-rows-[min-content_auto_min-content] lg:h-fit lg:min-h-dvh lg:bg-muted">
      <MobileOnly>
        <header className="sticky top-0 flex h-20 w-screen items-center justify-center bg-background px-4">
          <LogoLink />
        </header>
      </MobileOnly>
      <DesktopOnly>
        <Sidebar user={user} friendRequestsCount={friendRequestsCount} />
      </DesktopOnly>
      <main className="relative mx-auto grid w-full max-w-lg grid-rows-[auto_min-content] overflow-y-auto bg-muted sm:rounded lg:mx-0 lg:max-w-screen-2xl lg:overflow-visible lg:bg-transparent lg:pl-[21rem]">
        {children}
      </main>
      {user.isOnboarded && (
        <MobileOnly>
          <NavBar user={user} friendRequestsCount={friendRequestsCount} />
        </MobileOnly>
      )}
    </div>
  );
}

export function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative grid h-dvh grid-rows-[min-content_auto_min-content] lg:h-fit lg:min-h-dvh lg:bg-muted lg:px-5">
      <header className="relative h-20 w-screen bg-background lg:mx-auto lg:mt-4 lg:w-full lg:max-w-screen-2xl lg:rounded-xl">
        <div className="mx-auto flex h-full max-w-lg items-center justify-between px-4 lg:max-w-screen-2xl lg:px-8">
          <Link href="/" className="h-fit">
            <TextOnlyLogo />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher contentWidth filled />
            <DesktopOnly>
              <SignInButton buttonVariant="default" />
            </DesktopOnly>
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-lg bg-muted sm:mb-4 sm:rounded lg:max-w-screen-2xl lg:overflow-visible lg:bg-transparent lg:pl-8">
        {children}
      </main>
    </div>
  );
}

export function SignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-primary">
      <header className="fixed left-0 top-0 z-10 flex w-screen items-center justify-center gap-4 p-8">
        <Link href="/" className="h-fit rounded-full bg-primary p-2">
          <TextOnlyLogo />
        </Link>
      </header>
      <main className="relative h-dvh overflow-auto px-11 pb-10 pt-20 lg:pb-20">{children}</main>
    </div>
  );
}

export function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-dvh grid-rows-[min-content_auto_min-content] lg:bg-muted">
      <header className="relative h-20 w-screen bg-background lg:mx-auto lg:mt-4 lg:w-full lg:max-w-3xl lg:rounded-xl lg:px-4">
        <div className="mx-auto flex h-full max-w-xl items-center justify-between px-4 lg:w-full lg:max-w-3xl lg:px-0">
          <Link href="/" className="h-fit">
            <TextOnlyLogo />
          </Link>
          <LanguageSwitcher contentWidth filled />
        </div>
      </header>
      <main className="relative">{children}</main>
    </div>
  );
}

export function ContentLayout({ children, langSwitcher }: PropsWithChildren<{ langSwitcher: ReactNode }>) {
  return (
    <div>
      <header className="fixed left-0 top-0 z-10 h-20 w-screen bg-background">
        <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
          <Link href="/" className="h-fit">
            <TextOnlyLogo />
          </Link>
          {langSwitcher}
        </div>
      </header>
      <main id="markdown-content" className="relative mx-auto w-full max-w-3xl px-4 pt-20">
        {children}
      </main>
    </div>
  );
}
