import Link from "next/link";
import { Pill } from "@/components/app-shell";
import { label, moodTone } from "@/components/mood";
import { PageFrame } from "@/components/page-frame";
import { excerpt, filterEntries, formatDate, matchMood, uniqueMoods } from "@/lib/journal";
import { getJournalEntries } from "@/lib/mdx";

const SHORT_DATE: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric", year: "numeric" };

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ mood?: string | string[] }> }) {
  const { mood: moodParam } = await searchParams;
  const all = await getJournalEntries();
  const moods = uniqueMoods(all);
  const mood = matchMood(moods, moodParam);
  const entries = filterEntries(all, { mood });
  return (
    <PageFrame back={{ href: "/", label: "Journal" }}>
      <header className="as-intro">
        <h1>All entries</h1>
        <p>{entries.length} {entries.length === 1 ? "entry" : "entries"}{mood ? ` · ${label(mood)}` : ""}, newest first.</p>
      </header>
      {moods.length ? <nav className="as-chips as-chips-filter" aria-label="Filter by mood">
        <Link href="/journal" className="as-chip-link" aria-current={mood ? undefined : "page"}>All moods</Link>
        {moods.map((item) => (
          <Link key={item} href={`/journal?mood=${encodeURIComponent(item)}`} className="as-chip-link" aria-current={mood === item ? "page" : undefined}>{item}</Link>
        ))}
      </nav> : null}
      {entries.length ? (
        <ul className="as-list as-list-links">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/journal/${entry.slug}`} className="as-row as-row-link">
                <div>
                  <h3>{entry.title}</h3>
                  <p>{excerpt(entry.content, 130)}</p>
                  <p className="as-row-meta">{formatDate(entry.date, SHORT_DATE)}</p>
                </div>
                <Pill tone={moodTone(entry.mood)}>{label(entry.mood)}</Pill>
                <span className="as-chevron" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="as-list as-empty">
          <strong>No entries yet</strong>
          Entries are written as files in this site’s content. Once the first one is published it shows up here.
        </div>
      )}
    </PageFrame>
  );
}
