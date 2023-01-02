import FigureWrapper from "$lib/wrappers/Figure.svelte";
import { defaultBlockAt, mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { Selection } from "prosemirror-state";
import { SvelteNodeViewRenderer } from "svelte-tiptap";

interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: { src: string; alt?: string }) => ReturnType;
    };
  }
}

const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export default Node.create<FigureOptions>({
  name: "figure",
  inline: false,
  group: "block",
  content: "inline*",
  draggable: true,
  selectable: true,
  isolating: true,
  marks: "",

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("src")
      },

      alt: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("alt")
      },

      width: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("width")
      },

      height: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("height")
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        contentElement: "figcaption",
        getAttrs: (node) => {
          const datatype = (node as HTMLElement).getAttribute("data-type");
          return datatype === "figure" && null;
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, { "data-type": "figure" }),
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false
        })
      ],
      ["figcaption", 0]
    ];
  },

  addCommands() {
    return {
      setFigure:
        (attrs) =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({
                type: this.name,
                attrs: {
                  src: attrs.src
                }
              })
              // set cursor at end of caption field
              .command(({ tr, commands }) => {
                const { doc, selection } = tr;
                const position = doc.resolve(selection.to).end();

                return commands.setTextSelection(position);
              })
              .run()
          );
        }
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        console.log("enter", $from.parent.type, empty);
        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        return editor.commands.command(({ state, dispatch }) => {
          const { $head, $anchor } = state.selection;

          if (!$head.sameParent($anchor)) {
            return false;
          }

          const above = $head.node(-1);
          const after = $head.indexAfter(-1);
          const type = defaultBlockAt(above.contentMatchAt(after));

          if (!type || !above.canReplaceWith(after, after, type)) {
            return false;
          }

          if (dispatch) {
            const pos = $head.after();
            const tr = state.tr.replaceWith(pos, pos, type.createAndFill()!);

            tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
            dispatch(tr.scrollIntoView());
          }

          return true;
        });
      }
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, alt] = match;

          return { src, alt };
        }
      })
    ];
  },

  addNodeView() {
    return SvelteNodeViewRenderer(FigureWrapper);
  }
});
