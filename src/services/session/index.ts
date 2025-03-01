import { prisma } from "prisma/client";
import { Google } from "arctic";
import { User } from "~/services/user/types";
import { ServerError } from "~/services/errors";
import { cache } from "react";
import { cookies } from "next/headers";
import { Session } from "@prisma/client";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { toUser } from "~/services/user";

export type SessionValidationResult =
  | { session: Session; user: User; extended: boolean }
  | { session: null; user: User | null; extended?: undefined };

export const getGoogleAuth = (redirectUrlOrigin: string) => {
  return new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${redirectUrlOrigin}/api/auth/google/callback`,
  );
};

export const getSessionToken = cache(async () => {
  const cookiesMgmt = await cookies();
  return cookiesMgmt.get("session")?.value ?? null;
});

export const getSessionId = cache((token: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
});

export const getSessionUser = cache(async () => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) return null;

  const { user, session, extended } = await validateSessionToken(sessionToken);

  if (!user) {
    return null;
  }

  try {
    if (!session) {
      const token = generateSessionToken();
      const session = await createSession(token, user.id);
      await setSessionTokenCookie(sessionToken, session.expiresAt);
    } else if (extended) {
      await setSessionTokenCookie(sessionToken, session.expiresAt);
    }
  } catch {
    return null;
  }

  return user;
});

export const getSession = cache(async () => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) return null;

  const { session } = await validateSessionToken(sessionToken);

  return session;
});

export const getSessionUserOrThrow = cache(async () => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new ServerError("UNAUTHORIZED");
  }

  return sessionUser;
});

export function generateSessionToken(): string {
  return encodeBase32LowerCaseNoPadding(crypto.getRandomValues(new Uint8Array(20)));
}

export function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = getSessionId(token);
  return prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    },
  });
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = getSessionId(token);
  const result = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  // Session is expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: toUser(user) };
  }

  // Session is expiring in less than 15 days
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: session.expiresAt },
    });

    return { session, user: toUser(user), extended: true };
  }

  return { session, user: toUser(user), extended: false };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookiesMgmt = await cookies();
  cookiesMgmt.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    domain: process.env.NODE_ENV === "production" ? ".mywishcraft.app" : undefined,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deleteSessionTokenCookie() {
  const cookiesMgmt = await cookies();
  cookiesMgmt.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: process.env.NODE_ENV === "production" ? ".mywishcraft.app" : undefined,
    secure: process.env.NODE_ENV === "production",
  });
}
