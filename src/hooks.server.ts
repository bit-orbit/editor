import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { env } from "$env/dynamic/private";

export const handle = SvelteKitAuth({
  providers: [
    GitHub({
      clientId: env.GITHUB_ID as string,
      clientSecret: env.GITHUB_SECRET as string,
      authorization: { params: { scope: "public_repo" } }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});
