import { NextRequest, NextResponse } from "next/server";

// The default locale to use if no locale is detected
export const defaultLocale = "en";
// All supported locales
export const locales = ["en", "ru"];
// The cookie name used by i18next
const COOKIE_NAME = "i18next";

// Get the preferred locale from cookie, header, or default
function getLocale(request: NextRequest) {
  // Check if there is a cookie with the locale
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // If no cookie, try to get the locale from the Accept-Language header
  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const parsedLocale = parseAcceptLanguage(acceptLang);
    if (parsedLocale && locales.includes(parsedLocale)) {
      return parsedLocale;
    }
  }

  // If no locale is detected, use the default
  return defaultLocale;
}

// Parse the Accept-Language header to get the preferred locale
function parseAcceptLanguage(header: string): string | null {
  // Example header: "en-US,en;q=0.9,ru;q=0.8"
  try {
    // Split by comma to get language-priority pairs
    const languages = header.split(",");

    // Get the first language (highest priority)
    const primaryLang = languages[0].split(";")[0].trim();

    // Extract just the language code (e.g., "en" from "en-US")
    const langCode = primaryLang.split("-")[0];

    return langCode;
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

  // Create a response
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
