<script lang="ts">
  import TitleEditor from "$lib/components/TitleEditor.svelte";
  import MainEditor from "$lib/components/MainEditor.svelte";
  import { page } from "$app/stores";
  import { signIn } from "@auth/sveltekit/client";
</script>

{#if $page.data.session}
  <TitleEditor />
  <MainEditor />
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
