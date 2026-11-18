import * as Sentry from "@sentry/nextjs";
import { sentryOptions, withoutSessions } from "@/lib/sentry";

Sentry.init({ ...sentryOptions(process.env.NEXT_PUBLIC_SENTRY_DSN), integrations: (defaults) => withoutSessions(defaults) });
