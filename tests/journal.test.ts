import { describe, expect, it } from "vitest";
import { excerpt, filterEntries, isValidSlug, parseEntry } from "@/lib/journal";
import { getEntryBySlug, getJournalEntries, getMoods } from "@/lib/mdx";

describe("parseEntry", () => {
  it("keeps the date as a YYYY-MM-DD string even though YAML parses it as a Date", () => {
    const entry = parseEntry("x", "---\ntitle: X\ndate: 2026-02-18\nmood: calm\n---\nBody");
    expect(entry?.date).toBe("2026-02-18");
    expect(typeof entry?.date).toBe("string");
  });

  it("returns null when date or mood is missing or the date is invalid", () => {
    expect(parseEntry("x", "---\ntitle: X\nmood: calm\n---\n")).toBeNull();
    expect(parseEntry("x", "---\ndate: 2026-02-18\n---\n")).toBeNull();
    expect(parseEntry("x", "---\ndate: someday\nmood: calm\n---\n")).toBeNull();
  });

  it("falls back to the slug for a missing title and to [] for missing tags", () => {
    const entry = parseEntry("quiet-day", "---\ndate: 2026-01-01\nmood: calm\n---\nBody");
    expect(entry?.title).toBe("quiet-day");
    expect(entry?.tags).toEqual([]);
  });
});

describe("isValidSlug", () => {
  it("accepts kebab-case slugs only", () => {
    expect(isValidSlug("challenging-day")).toBe(true);
    expect(isValidSlug("../../README")).toBe(false);
    expect(isValidSlug("a/b")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("excerpt", () => {
  it("uses paragraph text only, without headings or list markers", () => {
    expect(excerpt("# Title\n\nFirst **bold** words.\n\n- item", 50)).toBe("First bold words.");
  });

  it("cuts long text on a word boundary with an ellipsis", () => {
    expect(excerpt("one two three four", 9)).toBe("one two…");
  });
});

describe("content loading", () => {
  it("loads the five entries newest first", async () => {
    const entries = await getJournalEntries();
    expect(entries.map((entry) => entry.slug)).toEqual([
      "happy-new-beginnings",
      "productive-work-day",
      "reflective-evening",
      "creative-breakthrough",
      "challenging-day",
    ]);
  });

  it("lists the five moods", async () => {
    expect(await getMoods()).toEqual(["excited", "frustrated", "happy", "productive", "reflective"]);
  });

  it("returns null for an unknown or unsafe slug", async () => {
    expect(await getEntryBySlug("nope")).toBeNull();
    expect(await getEntryBySlug("../../package")).toBeNull();
  });

  it("filters by mood, tag, query and date range", async () => {
    const entries = await getJournalEntries();
    expect(filterEntries(entries, { mood: "HAPPY" }).map((e) => e.slug)).toEqual(["happy-new-beginnings"]);
    expect(filterEntries(entries, { tag: "perseverance" }).map((e) => e.slug)).toEqual(["challenging-day"]);
    expect(filterEntries(entries, { query: "writer's block" }).map((e) => e.slug)).toEqual(["creative-breakthrough"]);
    expect(filterEntries(entries, { startDate: "2026-02-19", endDate: "2026-02-20" }).map((e) => e.slug)).toEqual([
      "reflective-evening",
      "creative-breakthrough",
    ]);
  });
});
