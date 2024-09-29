import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { getUserByUserId } from "prisma/handlers/user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {},
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async props => {
      const { session, user, token } = props;
      if (session.user) {
        const id = token?.sub || user?.id;

        // TODO refactor this this shit?
        const userData = await getUserByUserId(id);

        session.user.username = userData?.username || "";
        session.user.id = id;
      }

      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
