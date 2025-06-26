import Link from "next/link";
import { TextOnlyLogo } from "~/components/ui/logo";

export function LogoLink() {
  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      className="h-fit rounded ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <TextOnlyLogo />
    </Link>
  );
}
