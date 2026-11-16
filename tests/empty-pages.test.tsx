import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// With no published entries the pages show a first-run empty state instead of an empty list.
vi.mock("@/lib/mdx", () => ({ getJournalEntries: async () => [], getMoods: async () => [] }));

const { default: HomePage } = await import("@/app/page");
const { default: JournalPage } = await import("@/app/journal/page");

describe("no entries yet", () => {
  it("home shows the empty state and still the About section, without empty Moods or Recent lists", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain("No entries yet");
    expect(html).toContain(">About this journal</h2>");
    expect(html).not.toContain(">Moods</h2>");
    expect(html).not.toContain("Recent entries");
  });

  it("the archive shows the empty state and no mood filter", async () => {
    const html = renderToString(await JournalPage({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("No entries yet");
    expect(html).not.toContain("Filter by mood");
    expect(html).not.toContain("as-row-link");
  });
});
