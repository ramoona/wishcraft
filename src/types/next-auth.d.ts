import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string;
      username?: string;
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    image: string;
    username?: string;
  }
}
