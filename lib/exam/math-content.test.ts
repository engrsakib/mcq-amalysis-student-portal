import assert from "node:assert/strict";
import katex from "katex";
import { describe, it } from "node:test";
import { tryComposeUnifiedHybridLatex } from "./prepare-latex-content";

describe("tryComposeUnifiedHybridLatex", () => {
  it("composes math head and Bengali tail into one \\text{} document", () => {
    const raw = "x^2 - y^2 + 2y - 1 এর একটি উৎপাদক";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /^x\^2/);
    assert.match(composed!, /\\;\\text\{\s*এর একটি উৎপাদক\s*\}/);
  });

  it("composes when Bengali follows math without a space", () => {
    const raw = "x^2-y^2+2y-1এর একটি উৎপাদক";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /\\;\\text\{\s*এর একটি উৎপাদক\s*\}/);
  });

  it("strips ZWSP inside the math head", () => {
    const raw = "x^2 - y\u200B^2 + 2y - 1 এর একটি উৎপাদক";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.doesNotMatch(composed!, /\u200B/);
    assert.match(composed!, /y\^2/);
  });

  it("composes lines that already use \\text{} for Bengali", () => {
    const raw = String.raw`\sin75^{\circ}\text{ এর সঠিক মান কোনটি?}`;
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /\\sin/);
    assert.match(composed!, /\\text\{/);
  });

  it("splits math between Bengali clauses with unicode superscripts", () => {
    const raw = "x-y=3 হলে x²-y²-9xy এর মান";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /x-y=3\\;\\text\{\s*হলে\s*\}/);
    assert.match(composed!, /x\^2-y\^2-9xy\\;\\text\{/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("renders Q25-style hybrid as one KaTeX HTML document", () => {
    const composed = tryComposeUnifiedHybridLatex(
      "x^2 - y^2 + 2y - 1 এর একটি উৎপাদক"
    );
    assert.ok(composed);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.match(html, /katex/);
    assert.doesNotMatch(html, /katex-error/);
  });
});
