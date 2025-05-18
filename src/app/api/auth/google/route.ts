import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";
import { ServerError } from "~/services/errors";
import { NextRequest } from "next/server";
import { getGoogleAuth } from "~/services/session";

const cookieSettings = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 60 * 10,
  sameSite: "lax",
} as const;

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const wishlistOwner = url.searchParams.get("wishlistOwner");
  const wishId = url.searchParams.get("wishId");
  const language = url.searchParams.get("language");

  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const redirectUrl = getGoogleAuth(request.nextUrl.origin).createAuthorizationURL(state, codeVerifier, [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ]);
    const cookiesMgmt = await cookies();

    cookiesMgmt.set("google_oauth_state", state, cookieSettings);
    cookiesMgmt.set("code_verifier", codeVerifier, cookieSettings);

    if (language) {
      cookiesMgmt.set("language", language, cookieSettings);
    }

    if (wishlistOwner) {
      cookiesMgmt.set("wishlistOwner", wishlistOwner, cookieSettings);
    }

    if (wishId) {
      cookiesMgmt.set("wishId", wishId, cookieSettings);
    }
    return Response.redirect(redirectUrl);
  } catch {
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
}
