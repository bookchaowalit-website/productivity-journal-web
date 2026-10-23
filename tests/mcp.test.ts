import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }) as never);
}

async function call(name: string, args?: Record<string, unknown>, id = 1) {
  return (await rpc({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } })).json();
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    expect((await (await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" })).json()).id).toBe(7);
  });

  it("get_entries filters by mood and limit over the real files", async () => {
    const { result } = await call("get_entries", { limit: 2 });
    expect(result.entries.map((e: { slug: string }) => e.slug)).toEqual(["happy-new-beginnings", "productive-work-day"]);
    expect(result.entries[0].date).toBe("2026-02-22");
    const happy = await call("get_entries", { mood: "happy" });
    expect(happy.result.entries).toHaveLength(1);
  });

  it("get_entry_by_slug returns the entry and an invalid-params error for an unknown slug", async () => {
    expect((await call("get_entry_by_slug", { slug: "challenging-day" })).result.entry.title).toBe("Challenging Day");
    const missing = await call("get_entry_by_slug", { slug: "nope" }, 3);
    expect(missing.error.code).toBe(-32602);
    expect(missing.id).toBe(3);
  });

  it("get_entries_by_date requires both dates", async () => {
    const { result } = await call("get_entries_by_date", { startDate: "2026-02-21", endDate: "2026-02-22" });
    expect(result.entries).toHaveLength(2);
    expect((await call("get_entries_by_date", { startDate: "2026-02-21" })).error.code).toBe(-32602);
  });

  it("get_moods and search_entries answer from the same files", async () => {
    expect((await call("get_moods")).result.moods).toHaveLength(5);
    const { result } = await call("search_entries", { query: "typo" });
    expect(result.entries.map((e: { slug: string }) => e.slug)).toEqual(["challenging-day"]);
  });

  it("rejects an unknown tool, an unknown method and malformed JSON", async () => {
    expect((await call("delete_entry")).error.code).toBe(-32602);
    expect((await (await rpc({ jsonrpc: "2.0", id: 2, method: "resources/list" })).json()).error.code).toBe(-32601);
    const bad = await (await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }) as never)).json();
    expect(bad.error.code).toBe(-32700);
    expect(bad.id).toBeNull();
  });
});
