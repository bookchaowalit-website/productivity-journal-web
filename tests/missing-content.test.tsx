import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// A fresh checkout with no entries has no content/journal folder (Git keeps no empty folders). The real reader
// must treat that as "no entries yet", not crash the home page or the archive.
let dir: string;

async function loadWithoutContent() {
  dir = mkdtempSync(path.join(tmpdir(), "journal-empty-"));
  vi.spyOn(process, "cwd").mockReturnValue(dir);
  vi.resetModules();
  const mdx = await import("@/lib/mdx");
  const { default: HomePage } = await import("@/app/page");
  const { default: JournalPage } = await import("@/app/journal/page");
  return { mdx, HomePage, JournalPage };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  rmSync(dir, { recursive: true, force: true });
});

describe("no content/journal folder", () => {
  it("reads as an empty journal", async () => {
    const { mdx } = await loadWithoutContent();
    expect(await mdx.getJournalEntries()).toEqual([]);
    expect(await mdx.getMoods()).toEqual([]);
    expect(await mdx.getEntryBySlug("challenging-day")).toBeNull();
  });

  it("home and archive show the empty state", async () => {
    const { HomePage, JournalPage } = await loadWithoutContent();
    expect(renderToString(await HomePage())).toContain("No entries yet");
    expect(renderToString(await JournalPage({ searchParams: Promise.resolve({}) }))).toContain("No entries yet");
  });
});

describe("other read errors", () => {
  it("are thrown, not hidden as an empty journal", async () => {
    dir = mkdtempSync(path.join(tmpdir(), "journal-bad-"));
    const fs = await import("fs/promises");
    vi.spyOn(fs.default, "readdir").mockRejectedValueOnce(Object.assign(new Error("denied"), { code: "EACCES" }));
    vi.resetModules();
    const mdx = await import("@/lib/mdx");
    await expect(mdx.getJournalEntries()).rejects.toThrow("denied");
  });
});
