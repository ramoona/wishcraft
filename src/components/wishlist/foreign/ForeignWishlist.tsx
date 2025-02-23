import { WishlistType } from "~/services/wishlist/types";
import { ForeignWish } from "~/components/wishlist/foreign/ForeignWish";
import { WishItemList } from "~/components/wishlist/WishItemList";
import { OtherUser } from "~/services/user/types";
import { FriendActionButton } from "~/components/friends/FriendActionButton";

export function ForeignWishlist({ wishlist, owner }: { wishlist: WishlistType; owner: OtherUser }) {
  return (
    <div className="flex size-full flex-col gap-4 py-8">
      <h1 className="mb-4 text-2xl font-light">
        <span className="font-medium">{`${owner.username}'s`}</span> wishlist
      </h1>
      <FriendActionButton friendId={owner.id} isFriend={owner.isFriend} />
      <p>
        You can <b>anonymously</b> reserve some of the wishes
      </p>
      <WishItemList>
        {wishlist.wishes.length === 0 ? (
          <div>Nothing here yet</div>
        ) : (
          wishlist.wishes.map(wish => <ForeignWish data={wish} key={wish.id} isMobile={true} />)
        )}
      </WishItemList>
    </div>
  );
}
