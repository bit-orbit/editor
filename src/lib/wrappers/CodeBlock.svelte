<script lang="ts">
  import { NodeViewWrapper, editable } from "svelte-tiptap";
  import type { NodeViewProps } from "@tiptap/core";

  export let updateAttributes: NodeViewProps["updateAttributes"];
  export let extension: NodeViewProps["extension"];
</script>

<NodeViewWrapper as="pre" class="relative group" dir="ltr" spellcheck="false">
  <code use:editable contenteditable="true" />
  <select
    class="hljs absolute top-2 right-2 p-1 text-sm opacity-0 group-hover:opacity-100 duration-200"
    contenteditable="false"
    on:change={(event) => {
      updateAttributes({ language: event.currentTarget.value });
    }}
  >
    <option value="null">auto</option>
    {#each extension.options.lowlight.listLanguages() as language}
      <option value={language}>
        {language}
      </option>
    {/each}
  </select>
</NodeViewWrapper>
