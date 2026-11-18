import http from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import * as Sentry from "@sentry/nextjs";
// @sentry/browser is what @sentry/nextjs runs in the browser (installed with it): its real default list.
import { getDefaultIntegrations as browserDefaults } from "@sentry/browser";
import { withoutSessions } from "@/lib/sentry";
import { initNodeSentry } from "@/lib/sentry-node";

// Session (release-health) envelopes skip beforeSend, so the "errors only" promise needs them off entirely.
type Envelope = [unknown, [{ type: string }, unknown][]];

function recordingTransport(sent: string[]) {
  return () => ({
    send: async (envelope: Envelope) => {
      for (const [header] of envelope[1]) sent.push(header.type);
      return { statusCode: 200 };
    },
    flush: async () => true,
  });
}

async function serveOnce(): Promise<void> {
  const server = http.createServer((_req, res) => res.end("ok"));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  await fetch(`http://127.0.0.1:${port}/journal`).then((res) => res.text());
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

describe("withoutSessions", () => {
  it("removes the browser's BrowserSession integration and keeps the error integrations", () => {
    const names = withoutSessions(browserDefaults({})).map((integration) => integration.name);
    expect(browserDefaults({}).map((integration) => integration.name)).toContain("BrowserSession");
    expect(names).not.toContain("BrowserSession");
    expect(names).toEqual(expect.arrayContaining(["GlobalHandlers", "LinkedErrors"]));
  });

  it("removes Node's ProcessSession integration", () => {
    expect(withoutSessions([{ name: "ProcessSession" }, { name: "OnUncaughtException" }])).toEqual([{ name: "OnUncaughtException" }]);
  });

  it("swaps Http only when a replacement is given", () => {
    const http = { name: "Http", replaced: false };
    expect(withoutSessions([http])).toEqual([http]);
    expect(withoutSessions([http], () => ({ name: "Http", replaced: true }))).toEqual([{ name: "Http", replaced: true }]);
  });
});

describe("server init (lib/sentry-node, used by instrumentation.ts on Node.js)", () => {
  afterEach(async () => { await Sentry.close(); });

  it("sends no sessions envelope for a successful request, but still sends errors", async () => {
    const sent: string[] = [];
    initNodeSentry("https://key@o0.ingest.sentry.io/1", { release: "test-release", transport: recordingTransport(sent) as never });
    await serveOnce();
    Sentry.captureException(new Error("boom"));
    await Sentry.flush(2000);
    expect(sent).toContain("event");
    expect(sent).not.toContain("sessions");
    expect(sent).not.toContain("session");
  });
});
