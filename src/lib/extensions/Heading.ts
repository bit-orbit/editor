import { textblockTypeInputRule } from "@tiptap/core";
import TiptapHeading, { type HeadingOptions } from "@tiptap/extension-heading";

export default TiptapHeading.extend<HeadingOptions>({
  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level - 1}})\\s$`),
        type: this.type,
        getAttributes: {
          level: level
        }
      });
    });
  }
}).configure({
  levels: [2, 3, 4]
});
