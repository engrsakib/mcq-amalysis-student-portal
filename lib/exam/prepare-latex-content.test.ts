import assert from "node:assert/strict";
import katex from "katex";
import { describe, it } from "node:test";
import {
  isImplicitRawEquation,
  parseExamContentSegments,
  parseHybridUndelimitedSegments,
  repairMathLatex,
  tryComposeUnifiedHybridLatex,
  tryPrepareDirectKatexFormula,
  delimitedSegmentsToUndelimitedInput,
  delimiterParseLooksCorrupt,
  hasMicroInlineMathDelimiters,
  stripInlineDollarDelimiters,
  tryComposeDelimitedSegmentsToHybridLatex,
} from "./prepare-latex-content";
import { hasBengaliOutsideTextBlocks } from "./math-latex-repairs";

describe("tryComposeUnifiedHybridLatex", () => {
  it("inserts spaces between math and Bengali for Q14-style stems", () => {
    const raw = "x+2y=4 এবং \\frac{x}{y}=2 হলে, x এর মান কত?";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /4\\;\\text\{ এবং \}/);
    assert.match(composed!, /\\frac\{x\}\{y\}=2\\;\\text\{ হলে, x এর মান/);
    assert.doesNotMatch(composed!, /4\\text\{এবং/);
    assert.doesNotMatch(composed!, /=2\\text\{হলে/);
  });

  it("parses and composes Q4 multi-clause stems with thin-space glue", () => {
    const spaced = "x-y=3 হলে xy=24 হলে x+y এর মান −";
    const segments = parseHybridUndelimitedSegments(spaced);
    assert.equal(segments.length, 6);
    assert.deepEqual(
      segments.map((s) => s.kind),
      ["math", "prose", "math", "prose", "math", "prose"]
    );

    const composed = tryComposeUnifiedHybridLatex(spaced);
    assert.ok(composed);
    assert.match(composed!, /3\\;\\text\{ হলে \}/);
    assert.match(composed!, /24\\;\\text\{ হলে \}/);
    assert.match(composed!, /y\\;\\text\{ এর মান/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("composes Q4 CMS variant without spaces between clauses", () => {
    const raw = "x−y=3হলে xy=24হলেx+yএর মান−";
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /\\;\\text\{/);
    assert.doesNotMatch(composed!, /3\\text\{হলে/);
    assert.doesNotMatch(composed!, /24\\text\{হলে/);
  });

  it("composes Q15-style stems with CMS spaced superscripts", () => {
    const raw = "x−y=3 হলে x ^{ 2}-y^2-9xyএর মান −";
    const segments = parseHybridUndelimitedSegments(raw);
    assert.ok(segments.some((s) => s.kind === "math" && /x\^?\{?2\}?/.test(s.value)));
    assert.ok(segments.some((s) => s.kind === "prose" && /হলে/.test(s.value)));

    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.doesNotMatch(composed!, /\{\s+2\s+\}/);
    assert.match(composed!, /x(\^|\^\{)2/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("uses direct KaTeX path for MathLive-style \\text{} formulas", () => {
    const raw = String.raw`x^2-y^2+2y-1\text{ এর একটি উৎপাদক}`;
    const direct = tryPrepareDirectKatexFormula(raw);
    assert.ok(direct);
    assert.match(direct!, /\\text\{/);
    assert.equal(hasBengaliOutsideTextBlocks(direct!), false);
  });

  it("rejects direct KaTeX when Bengali is outside \\text{}", () => {
    const raw = "x-y=3 হলে xy=24";
    assert.equal(tryPrepareDirectKatexFormula(raw), null);
  });

  it("composes Q9-style glued multi-equation stem via hybrid path", () => {
    const raw = "x−y=1,xy=56হলেx+y=কত?";
    assert.equal(tryPrepareDirectKatexFormula(raw), null);
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, /\\text\{/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("repairs CMS spaced ascii superscripts in math segments", () => {
    const raw = "x 2 − y _{}^{ 2}+2y-1";
    const repaired = repairMathLatex(raw);
    assert.match(repaired, /x\^2/);
    assert.doesNotMatch(repaired, /_\s*\{\s*\}/);
  });

  it("composes micro-delimited Q1 perfect-square stem as one document", () => {
    const raw =
      "$m$ এর মান কত হলে $x$^2$+$x$-$m$ একটি পূর্ণবর্গ রাশি হবে।";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, true);
    assert.ok(hasMicroInlineMathDelimiters(segments));

    const rebuilt = delimitedSegmentsToUndelimitedInput(segments);
    const composed = tryComposeUnifiedHybridLatex(rebuilt);
    assert.ok(composed);
    assert.match(composed!, /x\^2\+x-m|x\^2 \+ x - m/);
    assert.match(composed!, /\\text\{/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("composes Q2-style leading prose plus delimited equation block", () => {
    const raw =
      "4 এবং $x + 2y = \\frac{x}{y} = 2$ হলে, x এর মান কত?";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, true);
    assert.equal(delimiterParseLooksCorrupt(segments), false);

    const composed = tryComposeDelimitedSegmentsToHybridLatex(segments);
    assert.ok(composed);
    assert.match(composed!, /\\text\{4 এবং \}/);
    assert.match(composed!, /\\frac\{x\}\{y\}/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("detects corrupt dollar parsing and rebuilds Q20-style fraction stem", () => {
    const raw = String.raw`x+2y=4$ এবং $\frac{x}{y}=2$ হলে, x এর মান কত?`;
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, true);
    assert.equal(delimiterParseLooksCorrupt(segments), true);

    const rebuilt = stripInlineDollarDelimiters(raw);
    const composed = tryComposeUnifiedHybridLatex(rebuilt);
    assert.ok(composed);
    assert.match(composed!, /x\+2y=4\\;\\text\{ এবং \}/);
    assert.match(composed!, /\\frac\{x\}\{y\}=2/);
    const html = katex.renderToString(composed!, {
      displayMode: false,
      output: "html",
      throwOnError: false,
      strict: false,
    });
    assert.doesNotMatch(html, /katex-error/);
  });

  it("composes delimited math block plus Bengali prose", () => {
    const raw = "$x^2 + x - m$ একটি পূর্ণবর্গ রাশি হবে।";
    const { segments } = parseExamContentSegments(raw);
    const composed = tryComposeDelimitedSegmentsToHybridLatex(segments);
    assert.ok(composed);
    assert.match(composed!, /x\^2 \+ x - m\\;\\text\{/);
  });

  it("preserves Bengali ZWNJ in prose tail", () => {
    const zwnj = "\u200C";
    const raw = `x^2 + 1 এর${zwnj}মান`;
    const composed = tryComposeUnifiedHybridLatex(raw);
    assert.ok(composed);
    assert.match(composed!, new RegExp(`\\\\text\\{.*${zwnj}`));
  });
});

describe("parseExamContentSegments", () => {
  it("splits Bengali prose and inline math without merging", () => {
    const raw = "বাংলা প্রশ্ন $ \\frac{a}{b} $ আরও বাংলা";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, true);
    assert.equal(segments.length, 3);
    assert.equal(segments[0].kind, "prose");
    assert.match((segments[0] as { value: string }).value, /বাংলা প্রশ্ন/);
    assert.deepEqual(segments[1], {
      kind: "math",
      display: "inline",
      value: "\\frac{a}{b}",
    });
    assert.match((segments[2] as { value: string }).value, /আরও বাংলা/);
  });

  it("parses double-dollar block math", () => {
    const raw = "$$ \\frac{\\frac{a}{b}}{c} $$";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, true);
    assert.equal(segments.length, 1);
    assert.deepEqual(segments[0], {
      kind: "math",
      display: "block",
      value: "\\frac{\\frac{a}{b}}{c}",
    });
  });

  it("leaves degree symbol and numbers in prose", () => {
    const raw = "তাপমাত্রা 30°";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, false);
    assert.equal(segments.length, 1);
    assert.equal((segments[0] as { value: string }).value, raw);
  });

  it("respects escaped dollar in prose", () => {
    const raw = "price \\$5 only";
    const { segments, hadDelimiters } = parseExamContentSegments(raw);
    assert.equal(hadDelimiters, false);
    assert.equal((segments[0] as { value: string }).value, raw);
  });
});

describe("repairMathLatex", () => {
  it("converts Bengali digits outside text in math", () => {
    assert.equal(repairMathLatex("\\sqrt{২}"), "\\sqrt{2}");
  });

  it("does not rewrite prose-only strings when used as math segment inner", () => {
    const inner = "\\frac{a}{b}";
    assert.equal(repairMathLatex(inner), inner);
  });
});

describe("isImplicitRawEquation", () => {
  it("matches raw API implicit fraction shape", () => {
    const raw = "ab ab+b 2 \\div a a+b";
    assert.equal(isImplicitRawEquation(raw), true);
    const repaired = repairMathLatex(raw);
    assert.match(repaired, /\\frac\{ab\+b\}\{ab\}/);
    assert.match(repaired, /\\div/);
  });

  it("rejects Bengali-containing strings", () => {
    assert.equal(isImplicitRawEquation("বাংলা ab ab+b \\div a"), false);
  });

  it("detects partial frac + raw tail after div", () => {
    const raw = "\\frac{ab+b}{ab}^2 \\div a a+b";
    assert.equal(isImplicitRawEquation(raw), true);
    assert.equal(
      repairMathLatex(raw),
      "\\frac{ab+b}{ab}^2 \\div \\frac{a+b}{a}"
    );
  });
});

describe("normalizeDivCommand via repairMathLatex", () => {
  it("fixes double-escaped \\\\div from API JSON", () => {
    const repaired = repairMathLatex("\\frac{1}{2} \\\\div \\frac{3}{4}");
    assert.match(repaired, /\\frac\{1\}\{2\} \\div \\frac\{3\}\{4\}/);
  });

  it("promotes \\\\div out of \\\\text{} so KaTeX renders ÷", () => {
    const repaired = repairMathLatex("\\text{foo \\div bar}");
    assert.match(repaired, /\\text\{foo\} \\div \\text\{bar\}/);
  });

  it("unwraps equation-only \\\\text{... \\\\div ...} wrapper", () => {
    const repaired = repairMathLatex("\\text{ab ab+b 2 \\div a a+b}");
    assert.match(repaired, /\\frac\{ab\+b\}\{ab\}/);
    assert.match(repaired, /\\div \\frac\{a\+b\}\{a\}/);
  });
});
