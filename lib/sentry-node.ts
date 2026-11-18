// Server (Node.js runtime) Sentry init. Kept out of instrumentation.ts because the Edge build of @sentry/nextjs
// has no httpIntegration; instrumentation.ts imports this file only when NEXT_RUNTIME is "nodejs".
import * as Sentry from "@sentry/nextjs";
import { sentryOptions, withoutSessions } from "@/lib/sentry";

type NodeInitExtras = Pick<Parameters<typeof Sentry.init>[0], "release" | "transport">;

export function initNodeSentry(dsn: string | undefined, extras: NodeInitExtras = {}) {
  Sentry.init({
    ...sentryOptions(dsn),
    ...extras,
    // Same Http integration @sentry/nextjs installs on Node.js, minus request sessions; it still reports errors.
    integrations: (defaults) => withoutSessions(defaults, () => Sentry.httpIntegration({ disableIncomingRequestSpans: true, sessions: false })),
  });
}
