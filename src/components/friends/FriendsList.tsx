import { FriendUser } from "~/services/user/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { WishType } from "~/services/wishlist/types";

const MAX_RECENT_WISHES = 3;

export function FriendsList({ friends }: { friends: FriendUser[] }) {
  if (!friends.length) {
    return <div>No friends yet</div>;
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <h1>Your Friends</h1>
      {friends.map(friend => (
        <div key={friend.id}>
          <Link href={`/${friend.username}`} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={friend.image || ""} />
              <AvatarFallback />
            </Avatar>
            <div className="flex items-center gap-1 text-lg">
              <span>{[friend.firstName, friend.lastName].filter(Boolean).join(" ")}</span>
              <span className="text-sm text-foreground/70">@{friend.username}</span>
            </div>
          </Link>
          {friend.recentWishes.length > 0 && (
            <div className="pl-16 text-sm text-foreground/80">
              Recently added {getRecentWishes(friend.recentWishes)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getRecentWishes(recentWishes: Pick<WishType, "name">[]) {
  const wishes = recentWishes.map(({ name }) => `"${name}"`);
  if (wishes.length > MAX_RECENT_WISHES) {
    return `${wishes.slice(0, MAX_RECENT_WISHES).join(", ")} and more...`;
  }

  return wishes.join(", ");
}
