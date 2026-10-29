// Reads runner data from Cloudflare D1.
// The database is attached to the Worker as a "binding" named DB (see wrangler.jsonc).
import { env } from "cloudflare:workers";
import type { Runner } from "../data/runners";

// Just the parts of D1 we use, so this file doesn't need extra type packages.
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(): Promise<T | null>;
}
interface D1Like {
  prepare(query: string): D1Statement;
}

interface RunnerRow {
  username: string;
  t_5k: number | null;
  t_10k: number | null;
  t_half: number | null;
  t_full: number | null;
}

function getDb(): D1Like {
  const db = (env as unknown as { DB?: D1Like }).DB;
  if (!db) throw new Error("D1 binding 'DB' is missing. Check wrangler.jsonc.");
  return db;
}

// Returns the runner, or null if there's no such username.
// Throws if the database can't be reached, so the page can tell "not found" from "broken".
export async function getRunner(username: string): Promise<Runner | null> {
  const row = await getDb()
    .prepare("SELECT username, t_5k, t_10k, t_half, t_full FROM runners WHERE username = ?")
    .bind(username)
    .first<RunnerRow>();

  if (!row) return null;
  return {
    username: row.username,
    times: { "5K": row.t_5k, "10K": row.t_10k, Half: row.t_half, Full: row.t_full },
  };
}
