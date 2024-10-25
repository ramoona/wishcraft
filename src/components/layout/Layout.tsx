import { PropsWithChildren } from "react";
import { getSessionUser } from "~/services/auth";
import { User } from "~/services/user/types";

import { Logo } from "~/components/ui/Logo";
import { UserMenu } from "~/components/user/UserMenu";

export async function Layout({ children }: PropsWithChildren) {
  const sessionUser = await getSessionUser();
  return (
    <div className="relative">
      {sessionUser ? (
        <AuthenticatedLayout user={sessionUser}>{children}</AuthenticatedLayout>
      ) : (
        <NonAuthenticatedLayout>{children}</NonAuthenticatedLayout>
      )}
    </div>
  );
}

function AuthenticatedLayout({ user, children }: PropsWithChildren<{ user: User }>) {
  return (
    <div className="relative">
      <header className="sticky left-0 top-0 flex h-16 w-screen justify-between px-8 py-4">
        <Logo />
        <UserMenu user={user} />
      </header>
      <main className="relative min-h-[calc(100vh_-_4rem)] px-8">{children}</main>
    </div>
  );
}

function NonAuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="sticky left-0 top-0 flex h-16 w-screen justify-center px-8 py-4">
        <Logo />
      </header>
      <main className="relative min-h-[calc(100vh_-_4rem)] px-8">{children}</main>
    </div>
  );
}

export function SignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <header className="sticky left-0 top-0 flex h-16 w-screen justify-center px-8 py-4">
        <Logo />
      </header>
      <main className="relative min-h-[calc(100vh_-_4rem)] px-8">
        <div className="fixed bottom-8 left-0 flex w-screen justify-center px-4">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}
