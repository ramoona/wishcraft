import { PropsWithChildren } from "react";
import { getSessionUser } from "~/services/auth";
import { Types } from "~/services/user/types";
import { buttonVariants } from "~/components/ui/button";
import { SignOut } from "@phosphor-icons/react/dist/ssr";

import { cn } from "~/utils/classnames";

export async function Layout({ children }: PropsWithChildren) {
  const sessionUser = await getSessionUser();
  return (
    <>
      {sessionUser ? (
        <UserHeader user={sessionUser} />
      ) : (
        <header className="bg-accent px-8 py-4 text-4xl">Wishcraft</header>
      )}
      <main className="flex min-h-screen flex-col items-start gap-4 p-8">{children}</main>
    </>
  );
}

function UserHeader({ user }: { user: Types }) {
  return (
    <header className="flex justify-between bg-accent px-8 py-4">
      <div className="text-4xl">Wishcraft</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.image ? (
            <img className="size-8 rounded-full" src={user.image} alt="User image" />
          ) : (
            <span className="size-6 rounded-full bg-stone-300" />
          )}
          {user.firstName}
        </div>
        <a
          className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2 no-underline")}
          href={`/api/auth/logout`}
        >
          <SignOut size={24} />
          Sign out
        </a>
      </div>
    </header>
  );
}
