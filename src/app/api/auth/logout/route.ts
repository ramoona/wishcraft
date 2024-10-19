import { getSessionId, lucia } from "~/services/auth";
import { ServerError } from "~/services/errors";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const sessionId = getSessionId();

  if (!sessionId) {
    return Response.redirect(request.nextUrl.origin);
  }

  try {
    await lucia.invalidateSession(sessionId);
    cookies().delete(lucia.sessionCookieName);
    return Response.redirect(request.nextUrl.origin);
  } catch (e) {
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
}
