import { PropsWithChildren } from "react";
import { User } from "~/services/user/types";

import { Logo } from "~/components/ui/logo";
import Link from "next/link";
import NavBar from "~/components/layout/NavBar";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";

export function AuthenticatedLayout({ user, children }: PropsWithChildren<{ user: User }>) {
  return (
    <div className="grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="relative flex w-screen justify-center bg-white p-8">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
      </header>
      <main className="relative overflow-auto bg-muted">{children}</main>
      {user.isOnboarded && <NavBar user={user} />}
    </div>
  );
}

export function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 z-10 flex w-screen items-center justify-between gap-4 p-8">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="relative min-h-screen overflow-auto px-4 pt-20">{children}</main>
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
        <div className="fixed bottom-8 left-0 flex w-screen justify-center">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function OnboardingLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="relative flex w-screen items-center justify-between gap-4 bg-white p-8">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="relative overflow-auto">{children}</main>
    </div>
  );
}
