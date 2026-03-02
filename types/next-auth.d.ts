import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      authId: string;
      dbId: string;
    } & DefaultSession["user"];
  }

  interface User {
    authId: string;
    dbId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authId: string;
    dbId?: string;
  }
}
