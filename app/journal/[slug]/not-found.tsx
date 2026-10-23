import Link from "next/link";

export default function EntryNotFound() {
  return <main className="field-shell missing-entry"><Link className="field-wordmark" href="/">BOOK / FIELD NOTES</Link><h1>Entry not found.</h1><Link className="text-link" href="/journal">Return to the archive <span>↗</span></Link></main>;
}
