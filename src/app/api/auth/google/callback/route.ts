import { createSession, generateSessionToken, getGoogleAuth, setSessionTokenCookie } from "~/services/session";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { prisma } from "prisma/db";
import { reserveWish } from "~/services/wishlist";
import { createUser } from "~/services/user";
import { ServerError } from "~/services/errors";
import { NextRequest } from "next/server";
import { SupportedLanguages } from "~/lib/i18n/settings";

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookiesMgmt = await cookies();
  const storedState = cookiesMgmt.get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookiesMgmt.get("code_verifier")?.value ?? null;
  const wishId = cookiesMgmt.get("wishId")?.value ?? null;
  const language = cookiesMgmt.get("language")?.value ?? null;

  if (!code || !storedCodeVerifier || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await getGoogleAuth(request.nextUrl.origin).validateAuthorizationCode(code, storedCodeVerifier);
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + tokens.accessToken(),
    );
    const googleUser: GoogleUser = await googleUserResponse.json();
    const existingUser = await prisma.user.findFirst({ where: { googleId: googleUser.sub } });

    cookiesMgmt.delete("google_oauth_state");
    cookiesMgmt.delete("code_verifier");

    if (existingUser) {
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, existingUser.id);

      await setSessionTokenCookie(sessionToken, session.expiresAt);
      cookiesMgmt.delete("wishlistOwner");
      cookiesMgmt.delete("wishId");

      if (wishId) {
        await reserveWish({ wishId, userId: existingUser.id });
      }

      cookiesMgmt.delete("wishlistOwner");
      cookiesMgmt.delete("wishId");
      cookiesMgmt.delete("language");

      return new Response(null, {
        status: 302,
        headers: {
          Location: wishId ? `/${existingUser.username}/friends/reserved-wishes` : "/",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
    const createdUser = await createUser({
      googleId: googleUser.sub,
      email: googleUser.email,
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      image: googleUser.picture,
      emailVerified: googleUser.email_verified,
      language: language as SupportedLanguages | null,
    });

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, createdUser.id);

    await setSessionTokenCookie(sessionToken, session.expiresAt);
    cookiesMgmt.delete("wishlistOwner");
    cookiesMgmt.delete("wishId");

    if (wishId) {
      await reserveWish({ wishId, userId: createdUser.id });
    }

    cookiesMgmt.delete("wishlistOwner");
    cookiesMgmt.delete("wishId");
    cookiesMgmt.delete("language");

    return new Response(null, {
      status: 302,
      headers: {
        Location: wishId ? `/${createdUser.username}/friends/reserved-wishes` : "/",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      throw new ServerError("OAUTH_ERROR");
    }
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
}

interface GoogleUser {
  sub: string;
  name: string; // full name
  given_name: string; // first name
  family_name: string; // last name
  picture: string; // profile picture
  email: string;
  email_verified: boolean;
}
