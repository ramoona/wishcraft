import { generateState, generateCodeVerifier } from "arctic";
import { googleAuth } from "~/services/auth";
import { cookies } from "next/headers";
import { ServerError } from "~/services/errors";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const wishlistOwner = url.searchParams.get("wishlistOwner");
  const wishId = url.searchParams.get("wishId");

  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const redirectUrl = await googleAuth.createAuthorizationURL(state, codeVerifier, {
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ],
    });

    cookies().set("google_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    cookies().set("code_verifier", codeVerifier, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    if (wishlistOwner) {
      cookies().set("wishlistOwner", wishlistOwner, {
        path: "/",
        secure: false,
        httpOnly: true,
        maxAge: 60,
        sameSite: "lax",
      });
    }

    if (wishId) {
      cookies().set("wishId", wishId, {
        path: "/",
        secure: false,
        httpOnly: true,
        maxAge: 60,
        sameSite: "lax",
      });
    }
    return Response.redirect(redirectUrl);
  } catch {
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
}
