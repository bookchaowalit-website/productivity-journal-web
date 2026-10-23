// Pure journal-entry rules shared by the pages, the MCP route and lib/mdx.ts (which only reads the files).
import matter from "gray-matter";
import { parseMarkdown } from "@/lib/markdown";

export type JournalEntry = { slug: string; title: string; date: string; mood: string; tags: string[]; content: string };
export type EntryFilter = { mood?: string; tag?: string; query?: string; startDate?: string; endDate?: string };

export const MOOD_CLASS: Record<string, string> = { happy: "mood-sun", productive: "mood-leaf", reflective: "mood-water", excited: "mood-coral", frustrated: "mood-ink", grateful: "mood-violet", calm: "mood-moss" };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Slugs are kebab-case file names; anything else (dots, slashes) never reaches the file system. */
export function isValidSlug(slug: string): boolean {
  return SLUG.test(slug);
}

/** YAML turns `date: 2026-02-18` into a Date; keep it as the YYYY-MM-DD string the type promises. */
function toDateString(value: unknown): string | null {
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

/** Parses one MDX file (front matter + markdown body). Null when date or mood is missing or the date is invalid. */
export function parseEntry(slug: string, raw: string): JournalEntry | null {
  const { data, content } = matter(raw);
  const date = toDateString(data.date);
  if (!date || typeof data.mood !== "string" || !data.mood) return null;
  return {
    slug,
    title: typeof data.title === "string" && data.title ? data.title : slug,
    date,
    mood: data.mood,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  };
}

export function sortNewestFirst(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export function uniqueMoods(entries: JournalEntry[]): string[] {
  return [...new Set(entries.map((entry) => entry.mood))].sort();
}

/** Mood and tag match exactly (mood ignores case); query matches title, body, tags or mood; dates are inclusive. */
export function filterEntries(entries: JournalEntry[], filter: EntryFilter): JournalEntry[] {
  const query = filter.query?.trim().toLowerCase();
  return entries.filter(
    (entry) =>
      (!filter.mood || entry.mood.toLowerCase() === filter.mood.toLowerCase()) &&
      (!filter.tag || entry.tags.includes(filter.tag)) &&
      (!filter.startDate || entry.date >= filter.startDate) &&
      (!filter.endDate || entry.date <= filter.endDate) &&
      (!query || [entry.title, entry.content, entry.mood, ...entry.tags].some((text) => text.toLowerCase().includes(query))),
  );
}

/** Plain text from the paragraphs only (no headings, list markers or emphasis marks), cut on a word boundary. */
export function excerpt(markdown: string, max: number): string {
  const text = parseMarkdown(markdown)
    .flatMap((block) => (block.type === "paragraph" ? [block.text] : []))
    .join(" ")
    .replace(/\*+/g, "");
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 0 ? cut.slice(0, space) : text.slice(0, max)).trimEnd()}…`;
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(value));
}
