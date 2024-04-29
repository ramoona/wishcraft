import { WishStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";

export function StatusBadge({ status }: { status: WishStatus }) {
  switch (status) {
    case WishStatus.RESERVED:
      return <Badge variant="secondary">Reserved</Badge>;
    case WishStatus.BOUGHT:
      return <Badge variant="secondary">Purchased</Badge>;
    case WishStatus.GIFTED:
      return <Badge variant="secondary">Gift</Badge>;
    default:
      return null;
  }
}
