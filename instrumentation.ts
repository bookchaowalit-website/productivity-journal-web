import * as Sentry from "@sentry/nextjs";
import { sentryOptions, withoutSessions } from "@/lib/sentry";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initNodeSentry } = await import("@/lib/sentry-node");
    initNodeSentry(process.env.NEXT_PUBLIC_SENTRY_DSN);
  } else {
    Sentry.init({ ...sentryOptions(process.env.NEXT_PUBLIC_SENTRY_DSN), integrations: (defaults) => withoutSessions(defaults) });
  }
}

export const onRequestError = Sentry.captureRequestError;
