import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// With a single entry the latest card already shows it: no Recent list and no "All entries" link that
// would only open an archive repeating that card.
vi.mock("@/lib/mdx", () => ({
  getJournalEntries: async () => [
    { slug: "only-one", title: "Only One", date: "2026-11-01", mood: "calm", tags: [], content: "Just this entry." },
  ],
  getMoods: async () => ["calm"],
}));

const { default: HomePage } = await import("@/app/page");

describe("home with one entry", () => {
  it("shows the latest card and mood chips, without a Recent list or an All entries link", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain('href="/journal/only-one"');
    expect(html).toContain('href="/journal?mood=calm"');
    expect(html).not.toContain("Recent entries");
    expect(html).not.toContain("All entries");
    expect(html).not.toContain('href="/journal"');
  });
});
