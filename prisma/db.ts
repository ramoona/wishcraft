import { PrismaClient as _PrismaClient } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";
import * as process from "process";

// See https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
declare global {
  // eslint-disable-next-line no-unused-vars, no-var
  var prisma: _PrismaClient | undefined;
}

export const prisma = global.prisma || new _PrismaClient();
export type PrismaClient = Omit<_PrismaClient, runtime.ITXClientDenyList>;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
