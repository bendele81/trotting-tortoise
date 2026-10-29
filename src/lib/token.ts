import { env } from "cloudflare:workers";

// The signing secret lives in Cloudflare (Settings > Variables and secrets), never in the code.
// Returns null if it's missing or too short, which switches editing off safely.
export function getEditSecret(): string | null {
  const s = (env as unknown as { EDIT_SECRET?: string }).EDIT_SECRET;
  return s && s.length >= 32 ? s : null;
}

export { createToken, verifyToken } from "./token-core";
