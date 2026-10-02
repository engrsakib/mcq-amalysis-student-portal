const UNSUPPORTED_COLOR = /oklab|oklch|color-mix|lab\(|lch\(/i;

const COLOR_PROPS =
  /^(color|background(-color)?|border(-.*-color)?|outline-color|fill|stroke|stop-color|flood-color|lighting-color|text-decoration-color)$/i;

let colorProbe: HTMLElement | null = null;

function getColorProbe(): HTMLElement {
  if (!colorProbe) {
    colorProbe = document.createElement("span");
    colorProbe.hidden = true;
    document.body.appendChild(colorProbe);
  }
  return colorProbe;
}

/** Force any color string to rgb/rgba via the browser. */
export function ensureRgbColor(
  raw: string,
  mode: "color" | "background" = "color"
): string {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "transparent" || trimmed === "inherit") {
    return trimmed;
  }
  if (!UNSUPPORTED_COLOR.test(trimmed)) {
    return trimmed;
  }

  const probe = getColorProbe();
  if (mode === "background") {
    probe.style.backgroundColor = "";
    probe.style.backgroundColor = trimmed;
    return getComputedStyle(probe).backgroundColor || "#ffffff";
  }
  probe.style.color = "";
  probe.style.color = trimmed;
  return getComputedStyle(probe).color || "#14221e";
}

function sanitizeCSSValue(prop: string, value: string): string {
  if (!value) return value;
  if (!UNSUPPORTED_COLOR.test(value)) return value;

  if (COLOR_PROPS.test(prop)) {
    return ensureRgbColor(
      value,
      prop.startsWith("background") ? "background" : "color"
    );
  }

  if (prop === "box-shadow" || prop === "text-shadow" || prop === "filter") {
    return value.replace(
      /oklab\([^)]*\)|oklch\([^)]*\)|color-mix\([^)]*\)|lab\([^)]*\)|lch\([^)]*\)/gi,
      "rgba(0,0,0,0.12)"
    );
  }

  if (prop === "background-image") {
    return "none";
  }

  return value.replace(
    /oklab\([^)]*\)|oklch\([^)]*\)|color-mix\([^)]*\)/gi,
    "rgb(128, 128, 128)"
  );
}

function pairElements(
  sourceRoot: HTMLElement,
  cloneRoot: HTMLElement
): Array<[HTMLElement, HTMLElement]> {
  const sources = [
    sourceRoot,
    ...sourceRoot.querySelectorAll<HTMLElement>("*"),
  ];
  const clones = [cloneRoot, ...cloneRoot.querySelectorAll<HTMLElement>("*")];
  const len = Math.min(sources.length, clones.length);
  const pairs: Array<[HTMLElement, HTMLElement]> = [];
  for (let i = 0; i < len; i += 1) {
    pairs.push([sources[i]!, clones[i]!]);
  }
  return pairs;
}

function inlineAllComputedStylesAsRgb(source: HTMLElement, target: HTMLElement) {
  const cs = getComputedStyle(source);
  for (let i = 0; i < cs.length; i += 1) {
    const prop = cs.item(i);
    if (!prop) continue;
    const value = cs.getPropertyValue(prop);
    if (!value) continue;
    target.style.setProperty(
      prop,
      sanitizeCSSValue(prop, value),
      cs.getPropertyPriority(prop)
    );
  }

  if (source instanceof HTMLImageElement && target instanceof HTMLImageElement) {
    target.src = source.currentSrc || source.src;
  }
}

export function applyRgbInlineTree(sourceRoot: HTMLElement, cloneRoot: HTMLElement) {
  for (const [source, target] of pairElements(sourceRoot, cloneRoot)) {
    inlineAllComputedStylesAsRgb(source, target);
  }
}

export function stripClassNames(root: HTMLElement) {
  root.removeAttribute("class");
  root.querySelectorAll("[class]").forEach((node) => {
    node.removeAttribute("class");
  });
}

export type PdfCaptureSandbox = {
  captureRoot: HTMLElement;
  iframe: HTMLIFrameElement;
  destroy: () => void;
};

export function mountPdfCaptureSandbox(
  sourceRoot: HTMLElement,
  exportWidthPx: number
): PdfCaptureSandbox {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${exportWidthPx}px;border:0;opacity:0;pointer-events:none;`;

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("Could not create PDF capture frame.");
  }

  doc.open();
  doc.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#ffffff"></body></html>'
  );
  doc.close();

  doc.body.style.margin = "0";
  doc.body.style.background = "#ffffff";
  doc.body.style.width = `${exportWidthPx}px`;

  const clone = sourceRoot.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("[data-pdf-export-ignore], [data-html2canvas-ignore]")
    .forEach((node) => {
      node.remove();
    });

  applyRgbInlineTree(sourceRoot, clone);
  stripClassNames(clone);

  clone.style.width = `${exportWidthPx}px`;
  clone.style.maxWidth = `${exportWidthPx}px`;
  clone.style.backgroundColor = "#ffffff";

  doc.body.appendChild(clone);

  const contentHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1);
  iframe.style.height = `${contentHeight}px`;

  return {
    captureRoot: clone,
    iframe,
    destroy: () => {
      iframe.remove();
    },
  };
}
