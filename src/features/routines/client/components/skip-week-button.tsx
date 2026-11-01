import { Pressable, Text } from "react-native";

import { type Routine, isWeekSkipped } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { weekStartOf } from "@/features/routines/client/week-offset";
import { useUndoStore } from "@/shared/undo";

type SkipWeekButtonProps = {
  routine: Routine;
  /** Whole weeks after the current one, matching the week the day chips are showing. */
  weekOffset: number;
};

/** Crosses the routine out for the shown week ("not doing the laundry next week"), or undoes it. */
export const SkipWeekButton = (props: SkipWeekButtonProps) => {
  const { routine, weekOffset } = props;
  const toggleSkipWeek = useAppStore((state) => {
    return state.routine.toggleSkipWeek;
  });
  const restoreTodo = useAppStore((state) => {
    return state.todo.restore;
  });
  const offerUndo = useUndoStore((state) => {
    return state.offer;
  });
  const weekStart = weekStartOf(weekOffset);
  const skipped = isWeekSkipped(routine, weekStart);
  const weekName = weekOffset > 0 ? "next week" : "this week";
  const onPress = () => {
    if (skipped) {
      toggleSkipWeek(routine.id, weekStart);
      return;
    }
    const planned = useAppStore.getState().todoItems.filter((todoItem) => {
      return todoItem.routineId === routine.id && !todoItem.done;
    });
    toggleSkipWeek(routine.id, weekStart);
    const removed = planned.filter((todoItem) => {
      return !useAppStore.getState().todoItems.includes(todoItem);
    });
    offerUndo(`Skipped "${routine.title}" ${weekName}`, () => {
      toggleSkipWeek(routine.id, weekStart);
      removed.forEach(restoreTodo);
    });
  };
  return (
    <Pressable
      onPress={onPress}
      testID="routine-skip-week"
      accessibilityRole="button"
      className="py-1"
    >
      <Text className="text-base text-ink">
        {skipped ? `Include ${weekName} again` : `Skip ${weekName}`}
      </Text>
    </Pressable>
  );
};
