import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Card and chip text (--as-muted excerpts, dates, chip counts) must keep 4.5:1 while hovered, in both themes.
const css = readFileSync(new URL("../app/app-shell.css", import.meta.url), "utf8");
const dark = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));

const token = (block: string, name: string) => block.match(new RegExp(`--${name}: (#[0-9a-f]{6})`, "i"))?.[1] ?? "";
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("card and chip hover", () => {
  it("uses the opaque surface hover token, not the translucent --as-hover", () => {
    expect(css).toMatch(/\.as-card-link:hover \{ background: var\(--as-surface-hover\); \}/);
    expect(css).toMatch(/\.as-chip-link:hover \{ background: var\(--as-surface-hover\); \}/);
  });

  for (const [theme, block] of [["light", css], ["dark", dark]] as const) {
    it(`keeps --as-muted and --as-fg at 4.5:1 or more on the hover colour (${theme})`, () => {
      const hover = token(block, "as-surface-hover");
      expect(hover).toMatch(/^#/);
      expect(contrast(token(block, "as-muted"), hover)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token(block, "as-fg"), hover)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
