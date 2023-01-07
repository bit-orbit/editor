import Turndown from "turndown";

const BULLET_LIST_MARKER = "-";

const OPTIONS: Turndown.Options = {
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: BULLET_LIST_MARKER,
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "_",
  strongDelimiter: "**",
  linkStyle: "inlined",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blankReplacement(_, node) {
    const parentNode = node.parentNode as HTMLElement;

    if (node.nodeName === "UL" || (parentNode?.nodeName === "UL" && node.nodeName === "LI")) {
      return `${BULLET_LIST_MARKER} `;
    }

    if (node.nodeName === "OL" || (parentNode?.nodeName === "OL" && node.nodeName === "LI")) {
      const start =
        node.nodeName === "LI"
          ? parentNode.getAttribute("start")
          : (node as HTMLElement).getAttribute("start");
      const index = Array.prototype.indexOf.call(parentNode.children, node);

      return `${start ? Number(start) + index : index + 1}. `;
    }

    return node.isBlock ? "\n\n" : "";
  }
};

const cleanAttribute = (attribute: string | null): string => {
  return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
};

const createMarkdownSerializer = () => {
  const turndown = new Turndown(OPTIONS);

  turndown.addRule("paragraph", {
    filter: "p",
    replacement: (content) => {
      return `\n\n${content}\n\n`;
    }
  });

  turndown.addRule("figure", {
    filter: "figure",
    replacement: (_, node) => {
      const img = (node as Element).querySelector("img");
      if (!img) return "";
      const src = String(img.getAttribute("src"));

      const figcaption = (node as Element).querySelector("figcaption");
      if (!figcaption) return "";
      const caption = figcaption.innerText;

      const title = cleanAttribute(img.getAttribute("title"));

      return src ? `![${caption}](${src}${title.length > 0 ? ` "${title}"` : ""})` : "";
    }
  });

  turndown.addRule("strikethrough", {
    filter: "s",
    replacement: function (content) {
      if (!content.trim()) return "";
      return "~~" + content + "~~";
    }
  });

  turndown.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node) {
      const hLevel = Number(node.nodeName.charAt(1));

      return "\n\n" + Array(hLevel).join("#") + " " + content + "\n\n";
    }
  });

  return {
    serialize: (html: string) => {
      return turndown.turndown(html);
    }
  };
};

export { createMarkdownSerializer };
