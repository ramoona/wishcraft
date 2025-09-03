import { WishlistError } from "~/services/wishlist/errors";
import { ServerError } from "~/services/errors";
import { UserError } from "~/services/user/errors";
import { Prisma } from "@prisma/client";

export type KnownError = WishlistError | ServerError | UserError;

export function isErrorKnown(error: Error): error is KnownError {
  return error instanceof WishlistError || error instanceof ServerError || error instanceof UserError;
}

export function getErrorCode(e: unknown) {
  if (isErrorKnown(e as Error)) {
    return (e as KnownError).errorCode;
  }

  if (
    e instanceof Prisma.PrismaClientKnownRequestError ||
    e instanceof Prisma.PrismaClientUnknownRequestError ||
    e instanceof Prisma.PrismaClientValidationError
  ) {
    // eslint-disable-next-line no-console
    console.error("Prisma error: ", e.message);
    return "PRISMA_ERROR";
  }

  if (e instanceof Error) {
    // eslint-disable-next-line no-console
    console.error("Unknown error:", e.message, e.name);
  }

  return "UNKNOWN";
}
