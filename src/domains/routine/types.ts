import { z } from "zod/v4";

export const MIN_TIMES_PER_WEEK = 2;
export const MAX_TIMES_PER_WEEK = 6;

/** How often a routine repeats. "x times a week" starts at 2 — once a week is just "weekly". */
export const RhythmSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("daily") }),
  z.object({ kind: z.literal("weekly") }),
  z.object({ kind: z.literal("biweekly") }),
  z.object({ kind: z.literal("monthly") }),
  z.object({
    kind: z.literal("timesPerWeek"),
    times: z.number().int().min(MIN_TIMES_PER_WEEK).max(MAX_TIMES_PER_WEEK),
  }),
]);
export type Rhythm = z.infer<typeof RhythmSchema>;

export const RoutineSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  rhythm: RhythmSchema,
  createdAt: z.number(),
});
export type Routine = z.infer<typeof RoutineSchema>;

export const RoutineDraftSchema = RoutineSchema.pick({
  title: true,
  rhythm: true,
});
export type RoutineDraft = z.infer<typeof RoutineDraftSchema>;
