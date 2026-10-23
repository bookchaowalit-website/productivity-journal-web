import { NextResponse } from "next/server";
import { excerpt, filterEntries, type JournalEntry } from "@/lib/journal";
import { getEntryBySlug, getJournalEntries, getMoods } from "@/lib/mdx";

// Stateless, read-only JSON-RPC MCP endpoint over the same five files in content/journal that the pages show.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  {
    name: "get_entries",
    description: "List journal entries, newest first, optionally filtered by mood or tag",
    inputSchema: { type: "object", properties: { mood: { type: "string" }, tag: { type: "string" }, limit: { type: "number" } } },
  },
  { name: "get_entry_by_slug", description: "Get one journal entry with its markdown body", inputSchema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] } },
  {
    name: "get_entries_by_date",
    description: "List entries between two dates (YYYY-MM-DD, inclusive)",
    inputSchema: { type: "object", properties: { startDate: { type: "string" }, endDate: { type: "string" } }, required: ["startDate", "endDate"] },
  },
  { name: "get_moods", description: "List the moods used in the entries", inputSchema: { type: "object", properties: {} } },
  { name: "search_entries", description: "Search titles, bodies, tags and moods", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function optionalString(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new RpcError(-32602, `${key} must be a string`);
  return value;
}

function requiredString(args: Record<string, unknown>, key: string): string {
  const value = optionalString(args, key);
  if (!value) throw new RpcError(-32602, `${key} is required`);
  return value;
}

const summary = (entry: JournalEntry) => ({ slug: entry.slug, title: entry.title, date: entry.date, mood: entry.mood, tags: entry.tags, excerpt: excerpt(entry.content, 150) });

async function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_entries": {
      const entries = filterEntries(await getJournalEntries(), { mood: optionalString(args, "mood"), tag: optionalString(args, "tag") });
      const limit = args.limit === undefined ? entries.length : Number(args.limit);
      if (!Number.isInteger(limit) || limit < 0) throw new RpcError(-32602, "limit must be a non-negative integer");
      return { entries: entries.slice(0, limit).map(summary) };
    }
    case "get_entry_by_slug": {
      const slug = requiredString(args, "slug");
      const entry = await getEntryBySlug(slug);
      if (!entry) throw new RpcError(-32602, `No journal entry with slug ${slug}`);
      return { entry };
    }
    case "get_entries_by_date": {
      const filter = { startDate: requiredString(args, "startDate"), endDate: requiredString(args, "endDate") };
      return { entries: filterEntries(await getJournalEntries(), filter).map(summary) };
    }
    case "get_moods":
      return { moods: await getMoods() };
    case "search_entries":
      return { entries: filterEntries(await getJournalEntries(), { query: requiredString(args, "query") }).map(summary) };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  let body: RpcRequest;
  try {
    body = (await request.json()) as RpcRequest;
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }
  id = body.id ?? null;
  try {
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "Journal Field Notes", version: "1.0.0" } };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = await callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    if (error instanceof RpcError) return NextResponse.json({ jsonrpc: "2.0", id, error: { code: error.code, message: error.message } }, { status: 400 });
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32603, message: "Internal error" } }, { status: 500 });
  }
}
