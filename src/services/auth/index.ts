import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "prisma/client";
import { Google } from "arctic";
import { User } from "~/services/user/types";
import { ServerError } from "~/services/errors";
import { cache } from "react";
import { cookies } from "next/headers";

export const LuciaPrismaAdapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(LuciaPrismaAdapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes): User => {
    return {
      id: attributes.id,
      email: attributes.email,
      image: attributes.image,
      username: attributes.username,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      dayOfBirth: attributes.dayOfBirth,
      monthOfBirth: attributes.monthOfBirth,
      defaultCurrency: attributes.defaultCurrency,
      showReserved: attributes.showReserved,
      completedOnboardingSteps: attributes.completedOnboardingSteps,
    };
  },
});

export const getGoogleAuth = (redirectUrlOrigin: string) => {
  return new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${redirectUrlOrigin}/api/auth/google/callback`,
  );
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}

export const getSessionId = cache(() => {
  return cookies().get(lucia.sessionCookieName)?.value ?? null;
});

export const getSessionUser = cache(async () => {
  const sessionId = getSessionId();
  if (!sessionId) return null;

  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    return null;
  }
  return user;
});

export const getSessionUserOrThrow = cache(async () => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new ServerError("UNAUTHORIZED");
  }

  return sessionUser;
});
