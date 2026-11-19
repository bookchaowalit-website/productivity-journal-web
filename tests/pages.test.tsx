import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import JournalPage from "@/app/journal/page";

describe("home page", () => {
  it("renders the notebook intro, the latest entry and the mood register", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain("<h1>Journal</h1>");
    expect(html).toContain('class="as"');
    expect(html).toContain("Happy New Beginnings");
    expect(html).toContain(">Moods</h2>");
    expect(html).not.toContain("# Happy New Beginnings");
  });
});

describe("archive page", () => {
  it("lists all five entries without a mood filter", async () => {
    const html = renderToString(await JournalPage({ searchParams: Promise.resolve({}) }));
    expect(html.match(/class="as-row as-row-link"/g)).toHaveLength(5);
    expect(html).toContain('href="/journal?mood=happy"');
  });

  it("the mood filter really filters the list", async () => {
    const html = renderToString(await JournalPage({ searchParams: Promise.resolve({ mood: "frustrated" }) }));
    expect(html.match(/class="as-row as-row-link"/g)).toHaveLength(1);
    expect(html).toContain("Challenging Day");
    expect(html).toMatch(/aria-current="page"[^>]*>frustrated|>frustrated<\/a>/);
  });
});

describe("about section", () => {
  it("home explains what the journal is and that reading stores nothing", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain(">About this journal</h2>");
    expect(html).toContain("read-only personal log");
  });

  it("says error reports still go to Sentry instead of claiming no scripts at all (PRODUCT.md item 5)", async () => {
    const html = renderToString(await HomePage());
    expect(html).toContain("there is no visitor analytics");
    expect(html).toMatch(/error report \(with personal data stripped\) goes to Sentry/);
    expect(html).not.toMatch(/no analytics or tracking scripts/);
  });
});

describe("home page (review 2026-11-18)", () => {
  it("does not repeat the latest entry in Recent entries", async () => {
    const html = renderToString(await HomePage());
    expect(html.match(/Happy New Beginnings/g)).toHaveLength(1);
    expect(html.match(/class="as-row as-row-link"/g)).toHaveLength(4);
  });

  it("the latest card links its title only, so the link name is the title", async () => {
    const html = renderToString(await HomePage());
    expect(html).toMatch(/<article class="as-card-link">/);
    expect(html).toMatch(/<h2><a class="as-stretched" href="\/journal\/[^"]+">Happy New Beginnings<\/a><\/h2>/);
  });

  it("mood chips carry a tone dot and say what the number counts", async () => {
    const html = renderToString(await HomePage()).replaceAll("<!-- -->", "");
    expect(html).toMatch(/<span class="as-dot" data-tone="amber" aria-hidden="true"><\/span>Excited <span class="as-chip-count">1<span class="as-sr"> entry<\/span><\/span>/);
  });
});
