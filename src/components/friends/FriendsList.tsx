import { FriendUser } from "~/services/user/types";
import Link from "next/link";

export function FriendsList({ friends }: { friends: FriendUser[] }) {
  if (!friends.length) {
    return <div>No friends yet</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh_-_4rem)] w-full flex-col gap-4 py-8">
      <h1>Your Friends:</h1>
      {friends.map(friend => (
        <Link href={`/${friend.username}`} key={friend.id}>
          <img src={friend.image || ""} alt="" />
          <div>
            {friend.firstName} {friend.lastName} ({friend.username})
          </div>
        </Link>
      ))}
    </div>
  );
}
