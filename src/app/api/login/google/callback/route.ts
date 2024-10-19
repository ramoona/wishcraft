import { googleAuth, lucia } from "~/services/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { prisma } from "prisma/client";
import { reserveWish } from "~/services/wishlist";
import { createUser } from "~/services/user";
import { ServerError } from "~/services/errors";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;
  const wishlistOwner = cookies().get("wishlistOwner")?.value ?? null;
  const wishId = cookies().get("wishId")?.value ?? null;

  if (!code || !storedCodeVerifier || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(code, storedCodeVerifier);
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + tokens.accessToken,
    );
    const googleUser: GoogleUser = await googleUserResponse.json();
    const existingUser = await prisma.user.findFirst({ where: { googleId: googleUser.sub } });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      cookies().delete("wishlistOwner");
      cookies().delete("wishId");

      if (wishId) {
        await reserveWish({ wishId, userId: existingUser.id });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: wishlistOwner ? `/${wishlistOwner}` : "/",
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
    });

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    cookies().delete("wishlistOwner");
    cookies().delete("wishId");

    if (wishId) {
      await reserveWish({ wishId, userId: createdUser.id });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: wishlistOwner ? `/${wishlistOwner}` : "/",
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
