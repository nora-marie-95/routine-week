import { z } from "zod/v4";

export const TodoItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  done: z.boolean(),
  /** When the todo was last checked off (epoch ms); routines count these toward their rhythm. */
  doneAt: z.number().optional(),
  routineId: z.string().optional(),
  /** Local day the todo is planned for, "YYYY-MM-DD". Every todo lives on a day. */
  dueDate: z.string(),
  createdAt: z.number(),
});
export type TodoItem = z.infer<typeof TodoItemSchema>;

export const TodoDraftSchema = TodoItemSchema.pick({
  title: true,
  routineId: true,
  dueDate: true,
});
export type TodoDraft = z.infer<typeof TodoDraftSchema>;
