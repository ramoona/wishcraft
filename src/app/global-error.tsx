"use client";

import Link from "next/link";
import { TextOnlyLogo } from "~/components/ui/logo";
import { ErrorMessage } from "~/components/ErrorMessage";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <header className="fixed left-0 top-0 z-10 flex h-24 w-screen justify-center px-8 py-4">
          <Link href="/" className="h-fit">
            <TextOnlyLogo />
          </Link>
        </header>
        <ErrorMessage errorCode="UNKNOWN" errorMessage={error.message} />
      </body>
    </html>
  );
}
