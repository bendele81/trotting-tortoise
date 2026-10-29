// Reads and writes runner data in Cloudflare D1.
// The database is attached to the Worker as a "binding" named DB (see wrangler.jsonc).
import { env } from "cloudflare:workers";
import type { Distance, Runner } from "../data/runners";

// Just the parts of D1 we use, so this file doesn't need extra type packages.
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
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
  link_version: number;
  deleted_at: string | null;
}

const COLUMNS = "username, t_5k, t_10k, t_half, t_full, link_version, deleted_at";

function getDb(): D1Like {
  const db = (env as unknown as { DB?: D1Like }).DB;
  if (!db) throw new Error("D1 binding 'DB' is missing. Check wrangler.jsonc.");
  return db;
}

function toRunner(row: RunnerRow): Runner {
  return {
    username: row.username,
    times: { "5K": row.t_5k, "10K": row.t_10k, Half: row.t_half, Full: row.t_full },
    linkVersion: row.link_version,
  };
}

// Public lookup. Returns null if there's no such username or the page was deleted.
// Throws if the database can't be reached, so the page can tell "not found" from "broken".
export async function getRunner(username: string): Promise<Runner | null> {
  const row = await getDb()
    .prepare(`SELECT ${COLUMNS} FROM runners WHERE username = ? AND deleted_at IS NULL`)
    .bind(username)
    .first<RunnerRow>();
  return row ? toRunner(row) : null;
}

// For the edit page: also tells us whether the page was deleted.
export async function getRunnerForEdit(username: string): Promise<(Runner & { deleted: boolean }) | null> {
  const row = await getDb()
    .prepare(`SELECT ${COLUMNS} FROM runners WHERE username = ?`)
    .bind(username)
    .first<RunnerRow>();
  return row ? { ...toRunner(row), deleted: row.deleted_at !== null } : null;
}

export async function updateTimes(username: string, times: Record<Distance, number | null>): Promise<void> {
  await getDb()
    .prepare(
      `UPDATE runners
          SET t_5k = ?, t_10k = ?, t_half = ?, t_full = ?, updated_at = datetime('now')
        WHERE username = ? AND deleted_at IS NULL`,
    )
    .bind(times["5K"], times["10K"], times.Half, times.Full, username)
    .run();
}

// "Delete" hides the page and wipes the times, but keeps the username reserved.
// Bumping link_version also cancels every old edit link.
export async function softDeleteRunner(username: string): Promise<void> {
  await getDb()
    .prepare(
      `UPDATE runners
          SET t_5k = NULL, t_10k = NULL, t_half = NULL, t_full = NULL, email_hash = NULL,
              link_version = link_version + 1, deleted_at = datetime('now'), updated_at = datetime('now')
        WHERE username = ?`,
    )
    .bind(username)
    .run();
}
