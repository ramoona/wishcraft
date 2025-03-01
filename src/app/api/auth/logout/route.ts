import { deleteSessionTokenCookie, getSession, invalidateSession } from "~/services/session";
import { ServerError } from "~/services/errors";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const session = await getSession();

  if (!session) {
    return Response.redirect(request.nextUrl.origin);
  }

  try {
    await invalidateSession(session.id);
    deleteSessionTokenCookie();
    return Response.redirect(request.nextUrl.origin);
  } catch {
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
}
