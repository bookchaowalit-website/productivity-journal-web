import Link from "next/link";
import type { ReactNode } from "react";
import { AppFoot } from "@/components/app-shell";

/** Shared frame for every page: top bar with the app name, one centred column, the footer. */
export function PageFrame({ children, back }: { children: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="as">
      <a className="as-skip" href="#main">Skip to content</a>
      <header className="as-top">
        <Link href="/" className="as-brand as-brand-link">Journal<small>A personal log of moods and work</small></Link>
        <nav aria-label="Site">
          {back ? <Link href={back.href}>‹ {back.label}</Link> : <a href="https://bookchaowalit.com/">Bookchaowalit</a>}
        </nav>
      </header>
      <main id="main" className="as-page">{children}</main>
      <AppFoot source="https://github.com/bookchaowalit-website/productivity-journal-web" />
    </div>
  );
}
