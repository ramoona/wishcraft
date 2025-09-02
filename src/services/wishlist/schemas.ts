import { z } from "zod";
import { WishStatus } from "@prisma/client";

export const WishlistReservationInputSchema = z.object({ wishId: z.string().min(1) });

export const WishCreationInputSchema = z.object({
  name: z.string().min(1),
  comment: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  isPrivate: z.boolean().optional().nullable(),
});

export const WishUpdateInputSchema = WishCreationInputSchema.omit({ name: true }).extend({
  id: z.string().min(1),
  name: z.string().optional(),
  reservedById: z.string().optional().nullable(),
  status: z.nativeEnum(WishStatus).optional(),
});
