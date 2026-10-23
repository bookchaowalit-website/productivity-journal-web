import Link from "next/link";
import { notFound } from "next/navigation";
import { MOOD_CLASS, formatDate } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { getEntryBySlug, getJournalEntries } from "@/lib/mdx";

const LONG_DATE: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };

export async function generateStaticParams() {
  return (await getJournalEntries()).map((entry) => ({ slug: entry.slug }));
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) notFound();
  return <main className="field-shell entry-shell"><header className="field-header"><Link className="field-wordmark" href="/">BOOK / FIELD NOTES</Link><nav><Link href="/journal">Archive</Link><span>Entry / {entry.slug}</span></nav></header><div className="field-spine" aria-hidden="true" /><article className="entry-paper"><div className="entry-top"><Link className="back-link" href="/journal">← All entries</Link><span className="entry-date">{formatDate(entry.date, LONG_DATE)}</span></div><div className="entry-title-block"><span className={`timeline-dot ${MOOD_CLASS[entry.mood] || "mood-ink"}`} /><div><p className="section-label">FIELD NOTE / {entry.mood}</p><h1>{entry.title}</h1><p className="entry-deck">Recorded {formatDate(entry.date, LONG_DATE)} · a note from the personal archive.</p></div></div><div className="entry-content"><div className="entry-margin">{entry.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><div className="entry-body">{renderMarkdown(entry.content, { dropTitle: entry.title })}</div></div></article><footer className="field-footer"><Link href="/">Notebook</Link><Link href="/journal">Next in archive ↗</Link></footer></main>;
}
