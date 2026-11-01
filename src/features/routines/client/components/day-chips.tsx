import { Pressable, Text, View } from "react-native";

import { useAppStore, useRoutineDays } from "@/domains/store";
import { type WeekDay, shiftDateKey, todayKey, weekDays } from "@/shared/util";

type DayChipsProps = {
  routineId: string;
  /** Whole weeks after the current one; defaults to the current week. */
  weekOffset?: number;
};

const DAYS_PER_WEEK = 7;

type DayChipProps = {
  day: WeekDay;
  routineId: string;
  planned: boolean;
  isToday: boolean;
};

const DayChip = (props: DayChipProps) => {
  const { day, routineId, planned, isToday } = props;
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
      onPress={onPress}
      testID={`day-chip-${routineId}-${day.key}`}
      accessibilityLabel={`${day.weekday} ${day.dayOfMonth}`}
      className={chipClassName}
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
  return (
    <View className="flex-row gap-1.5">
      {weekDays(shiftDateKey(today, weekOffset * DAYS_PER_WEEK)).map((day) => {
        return (
          <DayChip
            key={day.key}
            day={day}
            routineId={routineId}
            planned={plannedDays.includes(day.key)}
            isToday={day.key === today}
          />
        );
      })}
    </View>
  );
};
