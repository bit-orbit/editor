<script lang="ts">
  import {
    H1,
    H2,
    H3,
    Code,
    Blockquote,
    TextDirectionRtl,
    TextDirectionLtr,
    LineDashed,
    Bold,
    Italic,
    Underline,
    ListNumbers,
    ListDetails,
    Strikethrough
  } from "tabler-icons-svelte";
  import ToolbarButton from "$lib/components/ToolbarButton.svelte";
  import ToolbarButtonGroup from "$lib/components/ToolbarButtonGroup.svelte";
  import ToolbarLinkEditor from "$lib/components/ToolbarLinkEditor.svelte";
  import ToolbarImageInput from "$lib/components/ToolbarImageInput.svelte";
  import type { Editor } from "svelte-tiptap";

  export let editor: Editor;
</script>

<div
  class="flex flex-wrap items-center justify-center gap-x-3 bg-black text-white p-2 sticky top-0 z-50"
>
  <ToolbarButtonGroup>
    <ToolbarButton
      title="راست به چپ"
      active={editor.isActive({ dir: "rtl" })}
      on:click={() => editor.chain().focus().setTextDirection("rtl").run()}
    >
      <TextDirectionRtl />
    </ToolbarButton>

    <ToolbarButton
      title="چپ به راست"
      active={editor.isActive({ dir: "ltr" })}
      on:click={() => editor.chain().focus().setTextDirection("ltr").run()}
    >
      <TextDirectionLtr />
    </ToolbarButton>
  </ToolbarButtonGroup>

  <ToolbarButtonGroup>
    <ToolbarButton
      title="جدا کننده"
      active={editor.isActive("horizontalRule")}
      on:click={() => editor.chain().focus().setHorizontalRule().enter().run()}
    >
      <LineDashed />
    </ToolbarButton>

    <ToolbarImageInput {editor} />
  </ToolbarButtonGroup>

  <ToolbarButtonGroup>
    <ToolbarButton
      title="فهرست نقطه ای (Ctrl+Shift+8)"
      active={editor.isActive("bulletList")}
      on:click={() => editor.chain().focus().toggleBulletList().run()}
    >
      <ListDetails />
    </ToolbarButton>

    <ToolbarButton
      title="فهرست شماره گذاری شده (Ctrl+Shift+7)"
      active={editor.isActive("orderedList")}
      on:click={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <ListNumbers />
    </ToolbarButton>

    <ToolbarButton
      title="کد (Ctrl+Alt+C)"
      active={editor.isActive("codeBlock")}
      on:click={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code />
    </ToolbarButton>

    <ToolbarButton
      title="نقل‌قول (Ctrl+Shift+B)"
      active={editor.isActive("blockquote")}
      on:click={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <Blockquote />
    </ToolbarButton>
  </ToolbarButtonGroup>

  <ToolbarButtonGroup>
    <ToolbarButton
      title="عنوان ۲ (Ctrl+Alt+2)"
      active={editor.isActive("heading", { level: 2 })}
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <H1 />
    </ToolbarButton>

    <ToolbarButton
      title="عنوان ۳ (Ctrl+Alt+3)"
      active={editor.isActive("heading", { level: 3 })}
      on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    >
      <H2 />
    </ToolbarButton>

    <ToolbarButton
      title="عنوان ۴ (Ctrl+Alt+4)"
      active={editor.isActive("heading", { level: 4 })}
      on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
    >
      <H3 />
    </ToolbarButton>
  </ToolbarButtonGroup>

  <ToolbarButtonGroup>
    <ToolbarButton
      title="ضخیم (Ctrl+B)"
      active={editor.isActive("bold")}
      on:click={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold />
    </ToolbarButton>

    <ToolbarButton
      title="تاکید (Ctrl+I)"
      active={editor.isActive("italic")}
      on:click={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic />
    </ToolbarButton>

    <ToolbarButton
      title="خط زیر (Ctrl+U)"
      active={editor.isActive("underline")}
      on:click={() => editor.chain().focus().toggleUnderline().run()}
    >
      <Underline />
    </ToolbarButton>

    <ToolbarButton
      title="خط رو! (Ctrl+X)"
      active={editor.isActive("strike")}
      on:click={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough />
    </ToolbarButton>

    <ToolbarLinkEditor {editor} />
  </ToolbarButtonGroup>
</div>
