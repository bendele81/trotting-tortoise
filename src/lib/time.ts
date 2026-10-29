import type { Distance } from "../data/runners";

// Generous sanity limits in seconds, to catch typos like 2:41 for a 22:41 5K.
const LIMITS: Record<Distance, [number, number]> = {
  "5K": [12 * 60, 3 * 3600],
  "10K": [26 * 60, 5 * 3600],
  Half: [57 * 60, 7 * 3600],
  Full: [2 * 3600, 12 * 3600],
};

export type ParseResult = { ok: true; value: number | null } | { ok: false; error: string };

// Accepts "22:41" or "1:46:05". Blank means "not run yet".
export function parseTime(distance: Distance, input: string): ParseResult {
  const text = input.trim();
  if (text === "") return { ok: true, value: null };

  const m = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})$/.exec(text);
  if (!m) return { ok: false, error: "Use minutes:seconds, like 22:41, or h:mm:ss, like 1:46:05." };

  const hours = m[1] === undefined ? 0 : Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = Number(m[3]);
  if (seconds > 59 || (m[1] !== undefined && minutes > 59)) {
    return { ok: false, error: "Minutes and seconds go up to 59." };
  }

  const total = hours * 3600 + minutes * 60 + seconds;
  const [min, max] = LIMITS[distance];
  if (total < min || total > max) {
    return { ok: false, error: `That doesn't look right for a ${distance}. Check it and try again.` };
  }
  return { ok: true, value: total };
}
