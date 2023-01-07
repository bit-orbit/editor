<script lang="ts">
  import Link from "tabler-icons-svelte/icons/Link.svelte";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    Transition,
    TransitionChild
  } from "@rgossiaux/svelte-headlessui";
  import ToolbarButton from "$lib/components/ToolbarButton.svelte";
  import type { Editor } from "svelte-tiptap";

  export let editor: Editor;

  let open = false;
  let link = "";

  function setLink(link: string) {
    if (link.length < 1) {
      editor.chain().focus().unsetMark("link", { extendEmptyMarkRange: true }).run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({ href: link })
        .setTextSelection(editor.state.selection.to)
        .run();
    }
  }
</script>

<ToolbarButton
  title="لینک"
  active={editor.isActive("link")}
  on:click={() => {
    editor
      .chain()
      .focus()
      .command(({ editor }) => {
        link = editor.isActive("link") ? editor.getAttributes("link").href || "" : "";
        return true;
      });
    open = !open;
  }}
>
  <Link />
</ToolbarButton>

<Transition appear show={open}>
  <Dialog
    as="div"
    {open}
    class="relative z-50"
    on:close={() => {
      open = false;
      link = "";
    }}
  >
    <TransitionChild
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
    </TransitionChild>

    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all"
          >
            <DialogTitle as="h3" class="text-lg text-right font-medium leading-6 text-gray-900">
              ویرایش لینک
            </DialogTitle>

            <input
              dir="ltr"
              bind:value={link}
              class="mt-2 w-full py-2 px-4 text-black rounded"
              on:keydown={(e) => {
                if (link && e.key === "Enter") {
                  e.preventDefault();
                  setLink(link);
                }
              }}
              placeholder="https://..."
            />

            <div class="mt-4 flex gap-2">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                on:click={() => {
                  setLink(link);
                  open = false;
                }}
              >
                تایید
              </button>
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                on:click={() => (open = false)}
              >
                لغو
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</Transition>
