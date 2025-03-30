import Link from "next/link";
import { Logo } from "~/components/ui/logo";

export function LogoLink() {
  return (
    <Link href="/" className="h-fit">
      <Logo />
    </Link>
  );
}
