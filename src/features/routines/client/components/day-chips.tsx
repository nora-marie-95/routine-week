import { Pressable, Text, View } from "react-native";

import { isWeekSkipped } from "@/domains/routine";
import { useAppStore, useRoutine, useRoutineDays } from "@/domains/store";
import { daysOfWeek, weekStartOf } from "@/features/routines/client/week-offset";
import { type WeekDay, todayKey } from "@/shared/util";

type DayChipsProps = {
  routineId: string;
  /** Whole weeks after the current one; defaults to the current week. */
  weekOffset?: number;
};

type DayChipProps = {
  day: WeekDay;
  routineId: string;
  planned: boolean;
  isToday: boolean;
  /** The routine is crossed out for this week, so its days can't be planned. */
  skipped: boolean;
};

const DayChip = (props: DayChipProps) => {
  const { day, routineId, planned, isToday, skipped } = props;
  const toggleRoutineDay = useAppStore((state) => {
    return state.todo.toggleRoutineDay;
  });
  const onPress = () => {
    toggleRoutineDay(routineId, day.key);
  };
  const chipClassName = planned
    ? "flex-1 items-center rounded-full border-hair border-ink bg-ink py-1.5"
    : isToday
      ? "flex-1 items-center rounded-full border-hair border-ink bg-transparent py-1.5"
      : "flex-1 items-center rounded-full border-hair border-hairline bg-transparent py-1.5";
  return (
    <Pressable
      disabled={skipped}
      onPress={onPress}
      testID={`day-chip-${routineId}-${day.key}`}
      accessibilityLabel={`${day.weekday} ${day.dayOfMonth}`}
      className={skipped ? `${chipClassName} opacity-40` : chipClassName}
    >
      <Text className={planned ? "text-xs text-white" : "text-xs text-ink"}>{day.weekday}</Text>
    </Pressable>
  );
};

/** One week, Monday to Sunday — tap a day to put the routine on it (or take it off again). */
export const DayChips = (props: DayChipsProps) => {
  const { routineId, weekOffset = 0 } = props;
  const today = todayKey();
  const plannedDays = useRoutineDays(routineId);
  const routine = useRoutine(routineId);
  const skipped = routine !== undefined && isWeekSkipped(routine, weekStartOf(weekOffset));
  return (
    <View className="flex-row gap-1.5">
      {daysOfWeek(weekOffset).map((day) => {
        return (
          <DayChip
            key={day.key}
            day={day}
            routineId={routineId}
            planned={plannedDays.includes(day.key)}
            isToday={day.key === today}
            skipped={skipped}
          />
        );
      })}
    </View>
  );
};
