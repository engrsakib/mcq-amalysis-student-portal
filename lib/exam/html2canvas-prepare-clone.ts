/** Properties copied as inline styles so html2canvas need not parse Tailwind oklab/oklch rules. */
const INLINE_PROPS = [
  "color",
  "background-color",
  "background-image",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration",
  "text-transform",
  "white-space",
  "word-break",
  "opacity",
  "display",
  "flex",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "align-items",
  "align-self",
  "justify-content",
  "gap",
  "grid-template-columns",
  "grid-column",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-style",
  "border-right-style",
  "border-bottom-style",
  "border-left-style",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-radius",
  "box-shadow",
  "overflow",
  "overflow-x",
  "overflow-y",
  "vertical-align",
  "list-style",
  "object-fit",
] as const;

const COLOR_LIKE_PROPS = new Set<string>([
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
]);

const UNSUPPORTED_COLOR = /oklab|oklch|color-mix/i;

let colorProbe: HTMLElement | null = null;

function resolveSafeColor(raw: string): string {
  if (!raw || !UNSUPPORTED_COLOR.test(raw)) {
    return raw;
  }
  if (!colorProbe) {
    colorProbe = document.createElement("span");
    colorProbe.hidden = true;
    document.body.appendChild(colorProbe);
  }
  colorProbe.style.color = "";
  colorProbe.style.color = raw;
  return getComputedStyle(colorProbe).color || raw;
}

function safePropertyValue(prop: string, value: string): string {
  if (!value) return value;
  if (COLOR_LIKE_PROPS.has(prop)) {
    return resolveSafeColor(value);
  }
  if (prop === "box-shadow" && UNSUPPORTED_COLOR.test(value)) {
    return value.replace(
      /oklab\([^)]+\)|oklch\([^)]+\)|color-mix\([^)]+\)/gi,
      "rgba(0,0,0,0.15)"
    );
  }
  if (prop === "background-image" && UNSUPPORTED_COLOR.test(value)) {
    return "none";
  }
  return value;
}

function removeParsedStylesheets(clonedDoc: Document) {
  clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
    node.parentNode?.removeChild(node);
  });
}

/** Fallback palette when cloned stylesheets are stripped (html2canvas-safe rgb/hex only). */
function injectPdfSafeStyles(clonedDoc: Document) {
  const style = clonedDoc.createElement("style");
  style.textContent = `
    :root { color-scheme: light; }
    body { background: #ffffff; color: #14221e; }
  `;
  clonedDoc.head?.appendChild(style);
}

function syncInlineStyles(source: Element, target: Element) {
  if (!(source instanceof HTMLElement && target instanceof HTMLElement)) {
    return;
  }

  const computed = getComputedStyle(source);
  for (const prop of INLINE_PROPS) {
    const value = computed.getPropertyValue(prop);
    if (value) {
      target.style.setProperty(prop, safePropertyValue(prop, value));
    }
  }

  const sourceChildren = source.children;
  const targetChildren = target.children;
  const len = Math.min(sourceChildren.length, targetChildren.length);
  for (let i = 0; i < len; i += 1) {
    syncInlineStyles(sourceChildren[i]!, targetChildren[i]!);
  }
}

/**
 * html2canvas 1.x cannot parse oklab/oklch from Tailwind v4 stylesheets.
 * Strip cloned stylesheets and mirror resolved computed styles from the live tree.
 */
function stripClassNames(root: HTMLElement) {
  root.removeAttribute("class");
  root.querySelectorAll("[class]").forEach((node) => {
    node.removeAttribute("class");
  });
}

export function prepareHtml2CanvasClone(
  originalRoot: HTMLElement,
  clonedDoc: Document,
  clonedRoot: HTMLElement
) {
  removeParsedStylesheets(clonedDoc);
  injectPdfSafeStyles(clonedDoc);
  syncInlineStyles(originalRoot, clonedRoot);
  stripClassNames(clonedRoot);
}
