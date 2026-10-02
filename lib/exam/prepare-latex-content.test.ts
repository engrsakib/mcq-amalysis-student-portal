import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isImplicitRawEquation,
  parseExamContentSegments,
  repairMathLatex,
} from "./prepare-latex-content";

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
