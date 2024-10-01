import { googleAuth, lucia } from "~/auth/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { prisma } from "prisma/client";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;

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
    const existingUser = await prisma.user.findFirst({ where: { google_id: googleUser.sub } });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateId(15);
    await prisma.user.create({
      data: {
        id: userId,
        google_id: googleUser.sub,
        email: googleUser.email,
        emailVerified: googleUser.email_verified,
        image: googleUser.picture,
      },
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
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
