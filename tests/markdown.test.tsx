import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseMarkdown, renderMarkdown } from "@/lib/markdown";

describe("parseMarkdown", () => {
  it("splits headings, paragraphs and both list kinds into blocks", () => {
    const blocks = parseMarkdown("# Title\n\nOne line\nsame paragraph\n\n## Part\n- a\n- b\n\n1. x\n2. y\n");
    expect(blocks).toEqual([
      { type: "heading", level: 1, text: "Title" },
      { type: "paragraph", text: "One line same paragraph" },
      { type: "heading", level: 2, text: "Part" },
      { type: "list", ordered: false, items: ["a", "b"] },
      { type: "list", ordered: true, items: ["x", "y"] },
    ]);
  });

  it("starts a new list when the list kind changes", () => {
    expect(parseMarkdown("- a\n1. b").map((block) => block.type === "list" && block.ordered)).toEqual([false, true]);
  });
});

describe("renderMarkdown", () => {
  it("renders bold and italic inline text", () => {
    const html = renderToString(<>{renderMarkdown("Some **bold** and *soft* words")}</>);
    expect(html).toBe("<p>Some <strong>bold</strong> and <em>soft</em> words</p>");
  });

  it("escapes raw HTML instead of injecting it", () => {
    const html = renderToString(<>{renderMarkdown("<script>alert(1)</script>")}</>);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops a leading heading that repeats the given title and shifts the rest under the page h1", () => {
    const html = renderToString(<>{renderMarkdown("# Day\n\n## Part\n\ntext", { dropTitle: "Day" })}</>);
    expect(html).toBe("<h2>Part</h2><p>text</p>");
  });
});
