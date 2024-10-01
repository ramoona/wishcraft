import { Lucia } from "lucia";
import { LuciaPrismaAdapter } from "~/auth/prismaAdapter";
import { Google } from "arctic";
import { User } from "~/types/user";

export const lucia = new Lucia(LuciaPrismaAdapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: attributes => {
    return {
      id: attributes.id,
      email: attributes.email,
      name: attributes.name,
      image: attributes.image,
      username: attributes.username,
    };
  },
});

export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "http://localhost:3000/api/login/google/callback",
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
