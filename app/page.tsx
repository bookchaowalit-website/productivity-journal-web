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
  // The latest entry has its own card above; the list starts with the one before it. With one entry
  // (or none) the archive would only repeat that card, so the Recent list and its "All entries" link
  // are left out; the mood chips still open the archive filtered by mood.
  const recent = entries.slice(1, 6);
  return (
    <PageFrame>
      <header className="as-intro">
        <h1>Journal</h1>
        <p>A personal log of moods, work and the things that became clear after writing them down.</p>
      </header>

      {latest ? (
        // The link is the title only (a short accessible name); its ::after stretches the click area over the card.
        <article className="as-card-link">
          <p className="as-eyebrow">Latest · {formatDate(latest.date)}</p>
          <h2><Link href={`/journal/${latest.slug}`} className="as-stretched">{latest.title}</Link></h2>
          <p>{excerpt(latest.content, 260)}</p>
          <Pill tone={moodTone(latest.mood)}>{label(latest.mood)}</Pill>
        </article>
      ) : null}

      {entries.length ? (
        <>
          <section className="as-section" aria-labelledby="moods-title">
            <h2 id="moods-title" className="as-section-title">Moods</h2>
            <nav className="as-chips" aria-label="Browse by mood">
              {moods.map((mood) => {
                const count = entries.filter((entry) => entry.mood.toLowerCase() === mood.toLowerCase()).length;
                return (
                  <Link key={mood} href={`/journal?mood=${encodeURIComponent(mood)}`} className="as-chip-link">
                    <span className="as-dot" data-tone={moodTone(mood)} aria-hidden="true" />
                    {label(mood)} <span className="as-chip-count">{count}<span className="as-sr"> {count === 1 ? "entry" : "entries"}</span></span>
                  </Link>
                );
              })}
            </nav>
          </section>

          {recent.length ? <section className="as-section" aria-labelledby="recent-title">
            <div className="as-section-head">
              <h2 id="recent-title" className="as-section-title">Recent entries</h2>
              <Link href="/journal" className="as-plain">All entries ›</Link>
            </div>
            <ul className="as-list as-list-links">
              {recent.map((entry) => (
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
          </section> : null}
        </>
      ) : (
        <div className="as-list as-empty">
          <strong>No entries yet</strong>
          Entries are written as files in this site’s content. Once the first one is published it shows up here, newest first.
        </div>
      )}

      <section className="as-section" aria-labelledby="about-title">
        <h2 id="about-title" className="as-section-title">About this journal</h2>
        <ul className="as-note as-note-list">
          <li>A read-only personal log: each entry is a dated note with a mood, published with this site’s content and shown newest first.</li>
          <li>There is no account and nothing to type here: nothing is saved in your browser, and there is no visitor analytics.</li>
          <li>If the site breaks, an error report (with personal data stripped) goes to Sentry so it can be fixed.</li>
        </ul>
      </section>
      <p className="as-note">Written to understand, not to perform.</p>
    </PageFrame>
  );
}
