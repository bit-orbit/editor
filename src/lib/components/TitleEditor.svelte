<script lang="ts">
  import CharacterCount from "@tiptap/extension-character-count";
  import Placeholder from "@tiptap/extension-placeholder";
  import Heading from "@tiptap/extension-heading";
  import Text from "@tiptap/extension-text";
  import TextDirection from "$lib/extensions/TextDirection";
  import { Document } from "@tiptap/extension-document";

  import { onMount } from "svelte";
  import { createEditor } from "svelte-tiptap";
  import EditorContent from "svelte-tiptap/EditorContent.svelte";
  import type { Readable } from "svelte/store";
  import type { Editor } from "svelte-tiptap";

  let editor: Readable<Editor>;

  const CHAR_LIMIT = 100;

  const TitleDocument = Document.extend({
    content: "heading"
  });

  onMount(() => {
    editor = createEditor({
      extensions: [
        TitleDocument,
        Text,
        TextDirection.configure({ types: ["heading"] }),
        Heading.configure({
          levels: [1]
        }),
        Placeholder.configure({
          placeholder: "عنوان ..."
        }),
        CharacterCount.configure({
          limit: CHAR_LIMIT
        })
      ]
    });
  });
</script>

{#if $editor}
  <div class="prose prose-sm sm:prose-base mx-auto py-8 px-1 sm:px-2">
    <EditorContent editor={$editor} />
    <div class="text-gray-400 float-left">
      {new Intl.NumberFormat("fa").format(
        CHAR_LIMIT - $editor?.storage?.characterCount?.characters() || 0
      )}{" "}
      کاراکتر باقی مانده
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center h-32">
    <div class="prose animate-pulse w-full">
      <h1 class="rounded bg-gray-300 h-10" />
    </div>
  </div>
{/if}
