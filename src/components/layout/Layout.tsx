import { PropsWithChildren } from "react";
import { getSessionUser } from "~/services/auth";
import { User } from "~/services/user/types";

import { Logo } from "~/components/ui/logo";
import { UserMenu } from "~/components/user/UserMenu";
import Link from "next/link";

export async function Layout({ children }: PropsWithChildren) {
  const sessionUser = await getSessionUser();
  return sessionUser ? (
    <AuthenticatedLayout user={sessionUser}>{children}</AuthenticatedLayout>
  ) : (
    <NonAuthenticatedLayout>{children}</NonAuthenticatedLayout>
  );
}

function AuthenticatedLayout({ user, children }: PropsWithChildren<{ user: User }>) {
  return (
    <>
      <header className="fixed left-0 top-0 z-10 flex h-24 w-screen justify-between bg-white px-8 py-4">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
        <UserMenu user={user} />
      </header>
      <main className="relative min-h-screen px-4 py-20">{children}</main>
    </>
  );
}

function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 flex h-24 w-screen justify-center px-8 py-4">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
      </header>
      <main className="relative min-h-screen px-4 pt-20">{children}</main>
    </div>
  );
}

export function SignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed left-0 top-0 flex h-24 w-screen justify-center px-8 py-4">
        <Link href="/" className="h-fit">
          <Logo />
        </Link>
      </header>
      <main className="relative min-h-screen px-4 pt-20">
        <div className="fixed bottom-8 left-0 flex w-screen justify-center px-4">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}
