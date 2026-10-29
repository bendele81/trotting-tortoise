// SAMPLE DATA for the demo. The real site will read these from Shopify
// metaobjects instead. The shape stays the same on purpose: a username and
// four times in seconds (null = not run yet). Nothing else is stored.

export const DISTANCES = ["5K", "10K", "Half", "Full"] as const;
export type Distance = (typeof DISTANCES)[number];

export interface Runner {
  username: string;
  times: Record<Distance, number | null>;
}

const t = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

export const RUNNERS: Runner[] = [
  // The sample shirt's QR points here.
  { username: "test", times: { "5K": t(0, 24, 12), "10K": t(0, 51, 3), Half: t(1, 55, 40), Full: null } },
  { username: "slowandsteady", times: { "5K": t(0, 22, 41), "10K": t(0, 47, 18), Half: t(1, 46, 5), Full: null } },
  { username: "fastfrank", times: { "5K": t(0, 19, 48), "10K": t(0, 41, 30), Half: t(1, 31, 22), Full: t(3, 12, 9) } },
  { username: "turbo_turtle", times: { "5K": t(0, 31, 5), "10K": null, Half: null, Full: null } },
];

export function findRunner(username: string): Runner | null {
  return RUNNERS.find((r) => r.username === username) ?? null;
}
