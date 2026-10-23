import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { default: JournalEntryPage } = await import("@/app/journal/[slug]/page");

async function render(slug: string) {
  return renderToString(await JournalEntryPage({ params: Promise.resolve({ slug }) }));
}

describe("journal entry page", () => {
  it("reads the slug from the params Promise and renders the entry", async () => {
    const html = await render("challenging-day");
    expect(html).toContain("Challenging Day");
    expect(html).toContain("Wednesday, February 18, 2026");
  });

  it("renders markdown lists and bold text as HTML, not as raw markdown", async () => {
    const html = await render("challenging-day");
    expect(html).toContain("<li>Spent hours debugging only to realize the issue was a simple typo</li>");
    expect(html).toMatch(/<ol><li><strong>Double-check the basics<\/strong>/);
    expect(html).not.toContain("<p>- ");
    expect(html).not.toMatch(/<p>\d+\. /);
  });

  it("does not repeat the title as a heading inside the body", async () => {
    const html = await render("challenging-day");
    expect(html).not.toContain("<h2>Challenging Day</h2>");
    expect(html).toContain("<h2>The challenges</h2>");
  });

  it("answers an unknown slug with a real 404", async () => {
    await expect(render("does-not-exist")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("refuses a slug that tries to leave content/journal", async () => {
    await expect(render("../../README")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
