import Link from "next/link";
import { MOOD_CLASS, excerpt, filterEntries, formatDate, uniqueMoods } from "@/lib/journal";
import { getJournalEntries } from "@/lib/mdx";

const SHORT_DATE: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ mood?: string | string[] }> }) {
  const { mood: moodParam } = await searchParams;
  const all = await getJournalEntries();
  const moods = uniqueMoods(all);
  const mood = typeof moodParam === "string" && moods.includes(moodParam) ? moodParam : undefined;
  const entries = filterEntries(all, { mood });
  const tags = [...new Set(all.flatMap((entry) => entry.tags))];
  return <main className="field-shell archive-shell"><header className="field-header"><Link className="field-wordmark" href="/">BOOK / FIELD NOTES</Link><nav><Link href="/">Notebook</Link><span>Archive / {entries.length} notes</span></nav></header><div className="field-spine" aria-hidden="true" /><section className="archive-intro"><span className="section-label">INDEX / ALL OBSERVATIONS</span><h1>The field log.</h1><p>A dated record of moods, work, and the things that became clear after writing them down.</p></section><section className="archive-tools"><span>FILTERS</span><nav aria-label="Filter by mood"><Link href="/journal" className={mood ? undefined : "active-filter"} aria-current={mood ? undefined : "page"}>All moods</Link>{moods.map((item) => <Link key={item} href={`/journal?mood=${encodeURIComponent(item)}`} className={mood === item ? "active-filter" : undefined} aria-current={mood === item ? "page" : undefined}>{item}</Link>)}</nav><div><span className="tag-label">Topics</span>{tags.slice(0, 6).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></section><section className="archive-list">{entries.map((entry, index) => <Link className="archive-row" key={entry.slug} href={`/journal/${entry.slug}`}><span className="archive-index">{String(index + 1).padStart(2, "0")}</span><span className="archive-date">{formatDate(entry.date, SHORT_DATE)}</span><span className={`timeline-dot ${MOOD_CLASS[entry.mood] || "mood-ink"}`} /><span className="archive-title"><strong>{entry.title}</strong><small>{excerpt(entry.content, 130)}</small></span><span className="archive-mood">{entry.mood}</span><span className="timeline-arrow">↗</span></Link>)}</section><footer className="field-footer"><span>ARCHIVE / END OF INDEX</span><Link href="/">Return to notebook</Link></footer></main>;
}
