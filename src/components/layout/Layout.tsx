import { PropsWithChildren } from "react";
import { User } from "~/services/user/types";

import { Logo } from "~/components/ui/logo";
import Link from "next/link";
import NavBar from "~/components/layout/NavBar";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";

export function AuthenticatedLayout({ user, children }: PropsWithChildren<{ user: User }>) {
  return (
    <div className="grid h-dvh grid-rows-[min-content_auto_min-content]">
      <header className="relative flex h-24 w-screen justify-center bg-white px-8 py-4">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
      </header>
      <main className="relative overflow-auto p-4">{children}</main>
      {user.isOnboarded && <NavBar user={user} />}
    </div>
  );
}

export function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 z-10 flex h-24 w-screen items-center justify-between gap-4 px-8 py-4">
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
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 z-10 flex h-24 w-screen items-center justify-between gap-4 px-8 py-4">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="relative min-h-screen overflow-auto px-4 pt-20">
        <div className="fixed bottom-8 left-0 flex w-screen justify-center px-4">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}
