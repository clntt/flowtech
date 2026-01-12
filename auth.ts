// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [GitHub, Google],
// });

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const BASE_URI = "http://localhost:3000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;

      try {
        await fetch(`${BASE_URI}/api/auth/signin-with-oauth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            user: {
              name: user.name,
              email: user.email,
              username: user.email?.split("@")[0],
              image: user.image,
            },
          }),
        });
      } catch (err) {
        console.error("OAuth DB sync failed", err);
        return false; // blocks login if DB write fails
      }

      return true;
    },
  },
});
