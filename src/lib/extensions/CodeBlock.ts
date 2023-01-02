import CodeBlockWrapper from "$lib/wrappers/CodeBlock.svelte";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight/lib/common.js";
import { SvelteNodeViewRenderer } from "svelte-tiptap";

export default CodeBlockLowlight.extend({
  addNodeView() {
    return SvelteNodeViewRenderer(CodeBlockWrapper);
  }
}).configure({
  lowlight
});
