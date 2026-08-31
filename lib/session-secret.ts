// lib/session-secret.ts

/**
 * The key used to sign and verify session tokens.
 *
 * There is deliberately no fallback value. An earlier version defaulted to a
 * literal string when JWT_SECRET was missing, which meant a deployment without
 * the variable set would silently sign sessions with a secret published in this
 * repository: anyone could then forge a cookie for any user, including the
 * PROSESOR role that can delete records. Failing at startup is the safer
 * outcome, because a missing secret is a configuration bug, not a state the app
 * should quietly run in.
 *
 * Imported by both lib/auth.ts (Node runtime) and middleware.ts (Edge runtime),
 * so this module must not depend on anything Node-only.
 */
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error(
    "JWT_SECRET is not set. Generate one with `openssl rand -base64 32`, then " +
      "put it in .env for local development and in your hosting provider's " +
      "environment settings for deployments. See .env.example.",
  );
}

export const SESSION_SECRET = new TextEncoder().encode(secret);
