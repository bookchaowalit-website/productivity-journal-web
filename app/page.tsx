import Link from "next/link";
import { Pill } from "@/components/app-shell";
import { label, moodTone } from "@/components/mood";
import { PageFrame } from "@/components/page-frame";
import { excerpt, formatDate as format } from "@/lib/journal";
import { getJournalEntries, getMoods } from "@/lib/mdx";

const formatDate = (value: string) => format(value, { month: "short", day: "numeric", year: "numeric" });

export default async function HomePage() {
  const entries = await getJournalEntries();
  const moods = await getMoods();
  const latest = entries[0];
  return (
    <PageFrame>
      <header className="as-intro">
        <h1>Journal</h1>
        <p>A personal log of moods, work and the things that became clear after writing them down.</p>
      </header>

      {latest ? (
        <Link href={`/journal/${latest.slug}`} className="as-card-link">
          <p className="as-eyebrow">Latest · {formatDate(latest.date)}</p>
          <h2>{latest.title}</h2>
          <p>{excerpt(latest.content, 260)}</p>
          <Pill tone={moodTone(latest.mood)}>{label(latest.mood)}</Pill>
        </Link>
      ) : null}

      <section className="as-section" aria-labelledby="moods-title">
        <h2 id="moods-title" className="as-section-title">Moods</h2>
        <nav className="as-chips" aria-label="Browse by mood">
          {moods.map((mood) => (
            <Link key={mood} href={`/journal?mood=${encodeURIComponent(mood)}`} className="as-chip-link">
              {label(mood)} <span>{entries.filter((entry) => entry.mood === mood).length}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="as-section" aria-labelledby="recent-title">
        <div className="as-section-head">
          <h2 id="recent-title" className="as-section-title">Recent entries</h2>
          <Link href="/journal" className="as-plain">All entries ›</Link>
        </div>
        <ul className="as-list as-list-links">
          {entries.slice(0, 5).map((entry) => (
            <li key={entry.slug}>
              <Link href={`/journal/${entry.slug}`} className="as-row as-row-link">
                <div>
                  <h3>{entry.title}</h3>
                  <p className="as-row-meta">{formatDate(entry.date)}</p>
                </div>
                <Pill tone={moodTone(entry.mood)}>{label(entry.mood)}</Pill>
                <span className="as-chevron" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="as-note">Written to understand, not to perform.</p>
    </PageFrame>
  );
}
