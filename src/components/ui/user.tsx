import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { User } from "~/services/user/types";

const container = cva("flex items-center gap-4 bg-background p-4 no-underline");

export function UserDetails({
  user,
  extraContent,
  isLink,
  email,
}: {
  user: Pick<User, "username" | "firstName" | "lastName" | "image">;
  extraContent?: React.ReactNode;
  isLink?: boolean;
  email?: string;
}) {
  const content = (
    <>
      <Avatar className="size-16">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm text-foreground/70">@{user.username}</span>
        <span className="text-sm">
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}{" "}
          {email ? <span className="text-xs text-foreground/70">{`(${email})`}</span> : ""}
        </span>
        {extraContent}
      </div>
    </>
  );

  if (isLink) {
    return (
      <Link href={`/${user.username}`} className={container()}>
        {content}
      </Link>
    );
  }

  return <div className={container()}>{content}</div>;
}
