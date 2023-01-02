import type { Editor } from "svelte-tiptap";
import type { Readable } from "svelte/store";

export let mainEditor: Readable<Editor>;
export let titleEditor: Readable<Editor>;
