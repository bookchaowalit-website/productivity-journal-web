import Link from "next/link";
import { PageFrame } from "@/components/page-frame";

export default function EntryNotFound() {
  return (
    <PageFrame back={{ href: "/journal", label: "All entries" }}>
      <div className="as-list as-empty"><strong>Entry not found</strong>It may have been renamed or removed. <Link href="/journal">See all entries</Link>.</div>
    </PageFrame>
  );
}
