import Link from "next/link";
import { MOOD_CLASS, excerpt, formatDate as format } from "@/lib/journal";
import { getJournalEntries, getMoods } from "@/lib/mdx";

const formatDate = (value: string) => format(value, { month: "short", day: "numeric", year: "numeric" });

export default async function HomePage() {
  const entries = await getJournalEntries();
  const moods = await getMoods();
  const latest = entries[0];
  return <main className="field-shell">
    <header className="field-header"><Link className="field-wordmark" href="/">BOOK / FIELD NOTES</Link><nav><Link href="/journal">Archive</Link><a href="#about">About this notebook</a></nav></header>
    <div className="field-spine" aria-hidden="true" />
    <section className="field-intro"><div className="intro-label"><span>PERSONAL OBSERVATION LOG</span><span>VOL. 01 / 2026</span></div><div className="intro-grid"><h1>Notes from<br /><em>the middle.</em></h1><div className="intro-note"><p>One place to notice the work, moods, friction, and small evidence of a life in progress.</p><Link className="text-link" href="/journal">Read the full field log <span>↗</span></Link></div></div></section>
    {latest && <section className="featured-note"><div className="date-stamp"><span>LATEST NOTE</span><strong>{formatDate(latest.date)}</strong><i className={MOOD_CLASS[latest.mood] || "mood-ink"} /> <span>{latest.mood}</span></div><div className="featured-copy"><span className="rule-number">01</span><div><h2>{latest.title}</h2><p>{excerpt(latest.content, 260)}</p><Link className="text-link" href={`/journal/${latest.slug}`}>Open entry <span>→</span></Link></div></div></section>}
    <section className="mood-register"><div><span className="section-label">OBSERVATIONS BY WEATHER</span><h2>The mood register</h2></div><div className="mood-list">{moods.map((mood) => <div key={mood}><i className={MOOD_CLASS[mood] || "mood-ink"} /><span>{mood}</span><strong>{entries.filter((entry) => entry.mood === mood).length}</strong></div>)}</div></section>
    <section className="timeline-preview"><div className="section-heading"><div><span className="section-label">RECENT ARRIVALS</span><h2>On the page</h2></div><Link className="text-link" href="/journal">View archive <span>↗</span></Link></div><div className="timeline-list">{entries.slice(0, 5).map((entry) => <Link className="timeline-row" key={entry.slug} href={`/journal/${entry.slug}`}><span className="timeline-date">{formatDate(entry.date)}</span><span className={`timeline-dot ${MOOD_CLASS[entry.mood] || "mood-ink"}`} /><span className="timeline-title">{entry.title}</span><span className="timeline-mood">{entry.mood}</span><span className="timeline-arrow">↗</span></Link>)}</div></section>
    <footer id="about" className="field-footer"><span>BOOKCHAOWALIT / PRIVATE NOTEBOOK</span><span>Written to understand, not to perform.</span></footer>
  </main>;
}
