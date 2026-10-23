// Reads the journal files in content/journal. Parsing and filtering rules live in lib/journal.ts.
import fs from "fs/promises";
import path from "path";
import { isValidSlug, parseEntry, sortNewestFirst, uniqueMoods, type JournalEntry } from "@/lib/journal";

const ENTRIES_DIR = path.join(process.cwd(), "content", "journal");

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const files = (await fs.readdir(ENTRIES_DIR)).filter((file) => file.endsWith(".mdx"));
  const entries = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".mdx".length);
      const entry = parseEntry(slug, await fs.readFile(path.join(ENTRIES_DIR, file), "utf-8"));
      if (!entry) console.warn(`Skipping journal entry ${slug}: missing or invalid date or mood`);
      return entry;
    }),
  );
  return sortNewestFirst(entries.filter((entry): entry is JournalEntry => entry !== null));
}

/** Null for an unsafe or unknown slug; any other read error is thrown, not hidden. */
export async function getEntryBySlug(slug: string): Promise<JournalEntry | null> {
  if (!isValidSlug(slug)) return null;
  let raw: string;
  try {
    raw = await fs.readFile(path.join(ENTRIES_DIR, `${slug}.mdx`), "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  return parseEntry(slug, raw);
}

export async function getMoods(): Promise<string[]> {
  return uniqueMoods(await getJournalEntries());
}
