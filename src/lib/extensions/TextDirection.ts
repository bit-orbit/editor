import { Extension, findChildren } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";

export type Direction = "ltr" | "rtl";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (direction: Direction) => ReturnType;
    };
  }
}

export interface TextDirectionOptions {
  types: string[];
  directions: string[];
  defaultDirection: Direction | null;
}

const RTL = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
const LTR =
  "A-Za-z\u00C0-\u00D6\u00D8-\u00F6" +
  "\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C" +
  "\uFE00-\uFE6F\uFEFD-\uFFFF";

// eslint-disable-next-line no-misleading-character-class
const RTL_REGEX = new RegExp("^[^" + LTR + "]*[" + RTL + "]");
// eslint-disable-next-line no-misleading-character-class
const LTR_REGEX = new RegExp("^[^" + RTL + "]*[" + LTR + "]");

function getTextDirection(text: string): Direction | null {
  if (RTL_REGEX.test(text)) {
    return "rtl";
  }
  if (LTR_REGEX.test(text)) {
    return "ltr";
  }
  return null;
}

function TextDirectionPlugin({
  types,
  defaultDirection
}: {
  types: string[];
  defaultDirection: Direction | null;
}) {
  return new Plugin({
    key: new PluginKey("textDirection"),
    appendTransaction: (transactions, _oldState, newState) => {
      const tr: Transaction = newState.tr;
      let modified = false;

      if (transactions.some((transaction) => transaction.docChanged)) {
        const nodes = findChildren(newState.doc, (node) => {
          return types.includes(node.type.name);
        });

        nodes.forEach((block) => {
          const { node, pos } = block;
          const { attrs, textContent } = node;

          if (Boolean(attrs && attrs.dir) && textContent.length !== 0) {
            return;
          }

          const dir = getTextDirection(textContent);

          const newAttrs = {
            ...attrs,
            dir: dir === defaultDirection ? null : dir
          };

          tr.setNodeMarkup(pos, undefined, newAttrs);

          modified = true;
        });
      }

      return modified ? tr : null;
    }
  });
}

export default Extension.create<TextDirectionOptions>({
  name: "textDirection",

  addOptions() {
    return {
      types: [],
      directions: ["ltr", "rtl"],
      defaultDirection: null
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: (element) => {
              return element.dir || this.options.defaultDirection;
            },
            renderHTML: (attributes) => {
              return { dir: attributes.dir };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextDirection:
        (direction) =>
        ({ commands }) => {
          if (!this.options.directions.includes(direction)) {
            return false;
          }

          return this.options.types.every((type) =>
            commands.updateAttributes(type, { dir: direction })
          );
        }
    };
  },

  addProseMirrorPlugins() {
    return [
      TextDirectionPlugin({
        types: this.options.types,
        defaultDirection: this.options.defaultDirection
      })
    ];
  }
});
