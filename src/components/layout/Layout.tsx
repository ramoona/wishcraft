import { PropsWithChildren, ReactNode } from "react";
import { OtherUser, User } from "~/services/user/types";

import { Logo } from "~/components/ui/logo";
import Link from "next/link";
import NavBar from "~/components/layout/NavBar";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { Sidebar } from "~/components/layout/Sidebar";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";
import { LogoLink } from "~/components/layout/LogoLink";
import * as React from "react";

export function AuthenticatedLayout({
  user,
  children,
  otherUser,
}: PropsWithChildren<{ user: User; otherUser?: OtherUser }>) {
  return (
    <div className="relative grid h-dvh grid-rows-[min-content_auto_min-content] lg:h-fit lg:min-h-dvh lg:bg-muted">
      <MobileOnly>
        <header className="sticky top-0 flex h-20 w-screen items-center justify-center bg-background px-4">
          <LogoLink />
        </header>
      </MobileOnly>
      <DesktopOnly>
        <Sidebar user={user} />
      </DesktopOnly>
      <main className="relative mx-auto grid w-full max-w-lg grid-rows-[auto_min-content] overflow-y-auto bg-muted sm:rounded lg:mx-0 lg:max-w-screen-2xl lg:overflow-visible lg:bg-transparent lg:pl-80">
        {children}
      </main>
      {user.isOnboarded && (
        <MobileOnly>
          <NavBar user={user} otherUser={otherUser} />
        </MobileOnly>
      )}
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
      <main className="relative h-dvh overflow-auto px-11 pt-20">
        <div className="mx-auto size-full max-w-lg">{children}</div>
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

export function ContentLayout({ children, langSwitcher }: PropsWithChildren<{ langSwitcher: ReactNode }>) {
  return (
    <div>
      <header className="fixed left-0 top-0 z-10 h-20 w-screen bg-background">
        <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
          <Link href="/" className="h-fit">
            <Logo />
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
