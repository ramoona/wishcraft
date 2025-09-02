import { NextRequest, NextResponse } from "next/server";
import { fallbackLanguage, languages } from "~/lib/i18n/settings";

const COOKIE_NAME = "i18next";

// Get the preferred locale from cookie, header, or default
function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && languages.includes(cookieLocale as (typeof languages)[number])) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const parsedLocale = parseAcceptLanguage(acceptLang);
    if (parsedLocale && languages.includes(parsedLocale as (typeof languages)[number])) {
      return parsedLocale;
    }
  }

  return fallbackLanguage;
}

// Parse the Accept-Language header to get the preferred locale
// Example header: "en-US,en;q=0.9,ru;q=0.8"
function parseAcceptLanguage(header: string): string | null {
  try {
    const languages = header.split(",");
    const primaryLang = languages[0].split(";")[0].trim();

    return primaryLang.split("-")[0];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error parsing Accept-Language header:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Skip middleware for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/locales")
  ) {
    return NextResponse.next();
  }

  // Get the locale from the request
  const locale = getLocale(request);

  const response = NextResponse.next();

  // Set the locale cookie if it doesn't exist or is different
  // This is just for initial visits - i18next will manage the cookie after that
  if (request.cookies.get(COOKIE_NAME)?.value !== locale) {
    response.cookies.set(COOKIE_NAME, locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  const url = request.nextUrl;
  if (url.pathname.startsWith("/images")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable"); // 1 year caching for static images
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|locales).*)"],
};
