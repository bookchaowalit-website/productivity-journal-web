import { notFound } from "next/navigation";
import { Pill } from "@/components/app-shell";
import { label, moodTone } from "@/components/mood";
import { PageFrame } from "@/components/page-frame";
import { formatDate } from "@/lib/journal";
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
  return (
    <PageFrame back={{ href: "/journal", label: "All entries" }}>
      <article>
        <header className="as-intro">
          <p className="as-eyebrow">{formatDate(entry.date, LONG_DATE)}</p>
          <h1>{entry.title}</h1>
          <div className="as-tags">
            <Pill tone={moodTone(entry.mood)}>{label(entry.mood)}</Pill>
            {entry.tags.map((tag) => <span className="as-tag" key={tag}>#{tag}</span>)}
          </div>
        </header>
        <div className="as-prose">{renderMarkdown(entry.content, { dropTitle: entry.title })}</div>
      </article>
    </PageFrame>
  );
}
