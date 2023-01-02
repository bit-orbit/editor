<script lang="ts">
  import { NodeViewWrapper } from "svelte-tiptap";
  import type { NodeViewProps } from "@tiptap/core";

  export let updateAttributes: NodeViewProps["updateAttributes"];
  export let extension: NodeViewProps["extension"];
</script>

<NodeViewWrapper class="relative" dir="ltr">
  <pre spellCheck={false}>
		<code contenteditable="true" data-node-view-content="" style="white-space: pre-wrap;" />
		</pre>
  <select
    class="hljs absolute top-2 right-2 text-sm"
    contenteditable="false"
    on:change={(event) => {
      console.log(event.currentTarget.value);
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
