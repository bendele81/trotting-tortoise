// Shared shapes for runner data. The runners themselves now live in the D1 database
// (see db/schema.sql); this file only defines what a runner looks like.

export const DISTANCES = ["5K", "10K", "Half", "Full"] as const;
export type Distance = (typeof DISTANCES)[number];

export interface Runner {
  username: string;
  // Times in seconds. null = not run yet.
  times: Record<Distance, number | null>;
}
