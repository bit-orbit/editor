<script lang="ts">
  import Trash from "tabler-icons-svelte/icons/Trash.svelte";
  import cx from "clsx";
  import { NodeViewWrapper } from "svelte-tiptap";
  import type { NodeViewProps } from "@tiptap/core";

  export let node: NodeViewProps["node"];
  // export let updateAttributes: NodeViewProps["updateAttributes"];
  export let selected: NodeViewProps["selected"] = false;
  export let deleteNode: NodeViewProps["deleteNode"];
</script>

<NodeViewWrapper class={cx("svelte-component", { selected })}>
  <figure
    class="relative group"
    data-drag-handle
    draggable={true}
    contentEditable={false}
    aria-multiline={false}
  >
    <img src={node.attrs.src} alt="" />
    <button
      class={cx(
        "w-8 h-8 p-2 z-20",
        "absolute top-2 right-2 flex items-center justify-center",
        "opacity-0 group-hover:opacity-100 bg-gray-800 hover:bg-gray-700 text-rose-500 rounded",
        "ease-in-out transition duration-200"
      )}
      on:click={() => deleteNode()}
    >
      <Trash />
    </button>
    <figcaption class="text-center focus:outline-none" dir="auto" />
  </figure>
</NodeViewWrapper>
