<script lang="ts">
  import TitleEditor from "$lib/components/TitleEditor.svelte";
  import MainEditor from "$lib/components/MainEditor.svelte";
  import { page } from "$app/stores";
  import { mainEditorContent, titleEditorContent } from "$lib/stores";
  import { signIn } from "@auth/sveltekit/client";
  import { createMarkdownSerializer } from "$lib/markdownSerializer";
  import { goto } from "$app/navigation";
</script>

{#if $page.data.session}
  <TitleEditor />
  <MainEditor />
  <div class="sticky bottom-0 bg-white">
    <div class="!max-w-[600px] mx-auto p-1">
      <button
        disabled={$mainEditorContent.length < 1 || $titleEditorContent.length < 1}
        on:click={async () => {
          const res = await fetch("https://api.github.com/repos/bit-orbit/the-secret-bit/issues", {
            method: "POST",
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${$page.data.session?.accessToken}`
            },
            body: JSON.stringify({
              title: $titleEditorContent,
              body: createMarkdownSerializer().serialize($mainEditorContent),
              labels: ["chapter"]
            })
          });
          const data = await res.json();
          if (data.html_url) {
            goto(data.html_url);
          }
        }}
        class="bg-rose-500 px-3 py-2 rounded max-w-[65ch] text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >انتشار مقاله</button
      >
    </div>
  </div>
{:else}
  <div class="h-screen w-full flex items-center justify-center">
    <div
      class="text-center  bg-blue-100 p-8 mx-2 rounded-lg border-blue-300 border-2 border-dotted"
    >
      <p>
        برای دسترسی به ادیتور ابتدا باید با حساب گیتهاب خود <button
          class="text-rose-500 underline"
          on:click={async () => {
            signIn("github");
          }}>وارد شوید</button
        >
      </p>
      <p class="text-sm mt-2">
        ما هیچگونه اطلاعاتی از شما ذخیره نمیکنیم و این مرحله صرفا برای جلوگیری از حملات مخرب انجام
        میشود.
      </p>
    </div>
  </div>
{/if}
