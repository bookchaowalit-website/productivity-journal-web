import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import JournalPage from "@/app/journal/page";

describe("home page", () => {
  it("renders the notebook intro, the latest entry and the mood register", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain("the middle.");
    expect(html).toContain("Happy New Beginnings");
    expect(html).toContain("The mood register");
    expect(html).not.toContain("# Happy New Beginnings");
  });
});

describe("archive page", () => {
  it("lists all five entries without a mood filter", async () => {
    const html = renderToString(await JournalPage({ searchParams: Promise.resolve({}) }));
    expect(html.match(/class="archive-row"/g)).toHaveLength(5);
    expect(html).toContain('href="/journal?mood=happy"');
  });

  it("the mood filter really filters the list", async () => {
    const html = renderToString(await JournalPage({ searchParams: Promise.resolve({ mood: "frustrated" }) }));
    expect(html.match(/class="archive-row"/g)).toHaveLength(1);
    expect(html).toContain("Challenging Day");
    expect(html).toMatch(/aria-current="page"[^>]*>frustrated|>frustrated<\/a>/);
  });
});
