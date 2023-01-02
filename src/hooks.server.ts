import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { env } from "$env/dynamic/private";

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: env.GITHUB_ID as string, clientSecret: env.GITHUB_SECRET as string })
  ]
});
