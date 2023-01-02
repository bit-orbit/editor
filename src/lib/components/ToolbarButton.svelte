<script lang="ts">
  import cx from "clsx";
  import type { SvelteComponent } from "svelte";

  export let ref: HTMLButtonElement | undefined = undefined;
  export let icon: SvelteComponent | undefined = undefined;
  export let active = false;
  export let title: string | undefined;
</script>

<button
  bind:this={ref}
  on:click
  class={cx(
    "text-white stroke-white w-8 h-8 p-2",
    "flex items-center justify-center",
    "outline-none rounded font-bold border-transparent",
    "ease-in-out transition duration-200",
    active ? "bg-rose-500" : "bg-black"
  )}
  {title}
>
  {#if icon}
    <svelte:component this={icon} class="m-2 flex items-center" aria-hidden="true" />
  {/if}
  <slot />
</button>
