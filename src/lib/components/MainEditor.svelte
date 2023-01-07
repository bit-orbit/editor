<script lang="ts">
  import cx from "clsx";
  import StarterKit from "@tiptap/starter-kit";
  import Blockquote from "@tiptap/extension-blockquote";
  import CharacterCount from "@tiptap/extension-character-count";
  import Link from "@tiptap/extension-link";
  import Placeholder from "@tiptap/extension-placeholder";
  import SmilieReplacer from "$lib/extensions/SmilieReplacer";
  import Heading from "$lib/extensions/Heading";
  import TextDirection from "$lib/extensions/TextDirection";
  import CodeBlock from "$lib/extensions/CodeBlock";
  import Figure from "$lib/extensions/Figure";

  import { onMount } from "svelte";
  import { createEditor } from "svelte-tiptap";
  import { MAIN_EDITOR_LOCALSTORAGE_KEY } from "$lib/constants";
  import { mainEditorContent } from "$lib/stores";
  import Toolbar from "$lib/components/Toolbar.svelte";
  import EditorContent from "svelte-tiptap/EditorContent.svelte";
  import type { Readable } from "svelte/store";
  import type { Editor } from "svelte-tiptap";

  let editor: Readable<Editor>;

  onMount(() => {
    const content = window.localStorage.getItem(MAIN_EDITOR_LOCALSTORAGE_KEY) || "";
    mainEditorContent.set(content);
    editor = createEditor({
      content,
      onUpdate({ editor }) {
        const html = editor.getHTML();
        window.localStorage.setItem(MAIN_EDITOR_LOCALSTORAGE_KEY, html);
        mainEditorContent.set(html);
      },
      extensions: [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
          blockquote: false
        }),
        CodeBlock,
        Heading,
        Figure,
        SmilieReplacer,
        CharacterCount,
        TextDirection.configure({
          defaultDirection: "rtl",
          types: ["paragraph", "heading", "blockquote", "listItem"]
        }),
        Blockquote.extend({
          content: "paragraph*"
        }),
        Link.extend({
          inclusive: false
        }).configure({ openOnClick: false }),
        Placeholder.configure({
          placeholder: "یه چیزی بنویس...",
          includeChildren: true
        })
      ]
    });
  });
</script>

{#if $editor}
  <Toolbar editor={$editor} />
{/if}

{#if $editor}
  <div
    class={cx(
      "mt-6 mx-auto px-1 sm:px-2 pb-4 !max-w-[600px]",
      "prose prose-sm sm:prose-base md:prose-md",
      "prose-img:mb-2 prose-img:rounded prose-figcaption:text-center",
      "prose-a:text-rose-500"
    )}
  >
    <EditorContent editor={$editor} />
    <div class="text-gray-400">
      {new Intl.NumberFormat("fa", { useGrouping: false }).format(
        $editor?.storage?.characterCount?.words() || 0
      )} کلمه
    </div>
  </div>
{:else}
  <div class="flex flex-col items-center">
    <div class="animate-pulse w-full">
      <div class="bg-black h-12" />
    </div>
    <div class="mt-10" />
    <div class="prose animate-pulse w-full">
      <p class="rounded bg-gray-300 h-5" />
      <p class="rounded bg-gray-300 h-5" />
      <p class="rounded bg-gray-300 h-5 w-3/4" />
    </div>
  </div>
{/if}
