import { WishStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";

export function StatusBadge({ status }: { status: WishStatus }) {
  switch (status) {
    case WishStatus.RESERVED:
      return <Badge variant="secondary">Reserved</Badge>;
    default:
      return null;
  }
}
