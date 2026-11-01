import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import { ChevronRightIcon } from "lucide-react-native";

import { type Routine, formatRhythm, isWeekSkipped, rhythmForWeek } from "@/domains/routine";
import { DayChips } from "@/features/routines/client/components/day-chips";
import { RoutineProgressLabel } from "@/features/routines/client/components/routine-progress";
import { weekStartOf } from "@/features/routines/client/week-offset";

type RoutineRowProps = {
  routine: Routine;
  weekOffset: number;
};

const CHEVRON_SIZE = 18;
const CHEVRON_COLOR = "#8E8E93";

export const RoutineRow = (props: RoutineRowProps) => {
  const { routine, weekOffset } = props;
  const onPress = () => {
    router.push({
      pathname: "/routine/[id]",
      params: { id: routine.id, week: String(weekOffset) },
    });
  };
  const weekStart = weekStartOf(weekOffset);
  const skipped = isWeekSkipped(routine, weekStart);
  const rhythmChanged = routine.rhythmOverrides?.[weekStart] !== undefined;
  return (
    <View testID={`routine-row-${routine.id}`} className="gap-3 border-b-hair border-hairline py-3">
      <Pressable
        onPress={onPress}
        testID={`routine-open-${routine.id}`}
        accessibilityRole="button"
        className="flex-row items-center gap-3"
      >
        <View className="flex-1">
          <Text className={skipped ? "text-base text-subtle line-through" : "text-base text-ink"}>
            {routine.title}
          </Text>
          <Text className="text-sm text-subtle">
            {formatRhythm(rhythmForWeek(routine, weekStart))}
            {rhythmChanged ? " · only this week" : ""}
          </Text>
          <RoutineProgressLabel routine={routine} weekOffset={weekOffset} />
        </View>
        <ChevronRightIcon size={CHEVRON_SIZE} color={CHEVRON_COLOR} />
      </Pressable>
      <DayChips routineId={routine.id} weekOffset={weekOffset} />
    </View>
  );
};
