import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "prisma/client";

export const LuciaPrismaAdapter = new PrismaAdapter(prisma.session, prisma.user);
