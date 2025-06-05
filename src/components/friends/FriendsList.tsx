import { FriendUser } from "~/services/user/types";
import { getServerTranslations } from "~/lib/i18n/server";
import { UserDetails } from "~/components/ui/user";
import { EmptyList } from "~/components/ui/emptyList";

export async function FriendsList({ friends }: { friends: FriendUser[] }) {
  const { t } = await getServerTranslations();

  if (!friends.length) {
    return (
      <div className="grid grid-rows-[max-content_auto]">
        <h1 className="sticky top-0 z-10 bg-background pb-8 pt-4 text-center">{t("friends.title")}</h1>
        <div className="relative flex items-center justify-center bg-muted px-8 shadow-[0_-10px_0_5px_#fff] sm:rounded">
          <EmptyList shape="4" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="sticky top-0 z-10 bg-background pb-8 pt-4 text-center">{t("friends.title")}</h1>
      <div className="mx-auto my-4 flex w-full max-w-lg flex-col gap-4 px-4 pb-4">
        {friends.map(friend => {
          return (
            <UserDetails
              key={friend.id}
              user={friend}
              context="friends"
              extraContent={
                friend.recentWishes.length > 0 ? (
                  <div className="mt-1 truncate text-xs text-foreground/60">
                    {t("friends.recentWishes", { count: friend.recentWishes.length })}
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
