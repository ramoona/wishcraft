import { FriendUser } from "~/services/user/types";
import { WishType } from "~/services/wishlist/types";
import { getServerTranslations } from "~/lib/i18n/server";
import { UserDetails } from "~/components/ui/user";

const MAX_RECENT_WISHES = 3;

export async function FriendsList({ friends }: { friends: FriendUser[] }) {
  const { t } = await getServerTranslations();

  if (!friends.length) {
    return <div>{t("friends.empty")}</div>;
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <h1 className="rounded bg-background pb-8 pt-4 text-center">{t("friends.title")}</h1>
      <div className="mx-auto w-full max-w-xl px-4 pb-4">
        {friends.map(friend => {
          return (
            <UserDetails
              key={friend.id}
              user={friend}
              extraContent={
                friend.recentWishes.length > 0 ? (
                  <div className="mt-1 text-xs text-foreground/60">
                    {t("friends.recentWishes", { wishes: getRecentWishes(friend.recentWishes) })}
                  </div>
                ) : undefined
              }
              isLink
            />
          );
        })}
      </div>
    </div>
  );
}

function getRecentWishes(recentWishes: Pick<WishType, "name">[]) {
  const wishes = recentWishes.slice(0, MAX_RECENT_WISHES).map(({ name }) => `${name}`);

  return wishes.join(", ");
}
