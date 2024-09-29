import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="bg-accent px-8 py-4 text-4xl">Wishcraft</header>
      <main className="flex min-h-screen flex-col items-start gap-4 p-8">{children}</main>
      <footer>© 2021 Wishcraft</footer>
    </>
  );
}
