import { prisma } from "prisma/db";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const { ipHash, deviceType, os, osVersion, browser, browserVersion, url } = await req.json();

  await prisma.analyticsEvents.create({
    data: {
      ipHash,
      deviceType,
      os,
      osVersion,
      browser,
      browserVersion,
      url,
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
