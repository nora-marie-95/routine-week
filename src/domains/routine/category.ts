import type { Routine } from "@/domains/routine/types";

export type RoutineGroup = {
  /** Undefined for routines without a category. */
  title: string | undefined;
  data: Routine[];
};

/** The distinct category names in use, alphabetical. */
export const categoryNames = (routines: Routine[]) => {
  const names = new Set<string>();
  routines.forEach((routine) => {
    if (routine.category !== undefined) {
      names.add(routine.category);
    }
  });
  return [...names].sort((a, b) => {
    return a.localeCompare(b);
  });
};

/**
 * Turns typed input into a category: blank means none, and a name that only differs in case from
 * an existing one reuses that spelling — so "chores" doesn't split off from "Chores".
 */
export const resolveCategory = (input: string, existing: string[]) => {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const match = existing.find((name) => {
    return name.toLowerCase() === trimmed.toLowerCase();
  });
  return match ?? trimmed;
};

/** Categories alphabetically, each keeping creation order inside; uncategorised routines last. */
export const groupRoutines = (routines: Routine[]): RoutineGroup[] => {
  const groups: RoutineGroup[] = categoryNames(routines).map((name) => {
    return {
      title: name,
      data: routines.filter((routine) => {
        return routine.category === name;
      }),
    };
  });
  const uncategorised = routines.filter((routine) => {
    return routine.category === undefined;
  });
  return uncategorised.length > 0 ? [...groups, { title: undefined, data: uncategorised }] : groups;
};
