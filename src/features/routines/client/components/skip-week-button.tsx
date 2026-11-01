import { Pressable, Text, View } from "react-native";

import { CalendarOffIcon } from "lucide-react-native";

import { type Routine, isWeekSkipped } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { weekStartOf } from "@/features/routines/client/week-offset";
import { useUndoStore } from "@/shared/undo";

type SkipWeekButtonProps = {
  routine: Routine;
  /** Whole weeks after the current one, matching the week the day chips are showing. */
  weekOffset: number;
};

const ICON_SIZE = 20;
const ICON_COLOR = "#1C1C1E";

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
  const onSkipPress = () => {
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
  const onIncludePress = () => {
    toggleSkipWeek(routine.id, weekStart);
  };
  if (skipped) {
    return (
      <View
        testID="routine-skipped-banner"
        className="flex-row items-center justify-between gap-3 rounded-xl bg-black/10 px-4 py-3"
      >
        <View className="flex-1">
          <Text className="text-base font-medium text-ink">Skipped {weekName}</Text>
          <Text className="text-sm text-subtle">Crossed out, nothing planned</Text>
        </View>
        <Pressable
          onPress={onIncludePress}
          testID="routine-skip-week"
          accessibilityRole="button"
          className="rounded-full bg-ink px-4 py-2"
        >
          <Text className="font-medium text-white">Include again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onSkipPress}
      testID="routine-skip-week"
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-xl bg-black/5 px-4 py-3"
    >
      <CalendarOffIcon size={ICON_SIZE} color={ICON_COLOR} />
      <View className="flex-1">
        <Text className="text-base font-medium text-ink">Skip {weekName}</Text>
        <Text className="text-sm text-subtle">Cross it out and clear its planned days</Text>
      </View>
    </Pressable>
  );
};
