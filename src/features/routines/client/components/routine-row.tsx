import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import { ChevronRightIcon } from "lucide-react-native";

import { type Routine, formatRhythm } from "@/domains/routine";
import { DayChips } from "@/features/routines/client/components/day-chips";
import { RoutineProgressLabel } from "@/features/routines/client/components/routine-progress";

type RoutineRowProps = {
  routine: Routine;
};

const CHEVRON_SIZE = 18;
const CHEVRON_COLOR = "#8E8E93";

export const RoutineRow = (props: RoutineRowProps) => {
  const { routine } = props;
  const onPress = () => {
    router.push({ pathname: "/routine/[id]", params: { id: routine.id } });
  };
  return (
    <View testID={`routine-row-${routine.id}`} className="gap-3 border-b-hair border-hairline py-3">
      <Pressable
        onPress={onPress}
        testID={`routine-open-${routine.id}`}
        accessibilityRole="button"
        className="flex-row items-center gap-3"
      >
        <View className="flex-1">
          <Text className="text-base text-ink">{routine.title}</Text>
          <Text className="text-sm text-subtle">{formatRhythm(routine.rhythm)}</Text>
          <RoutineProgressLabel routine={routine} />
        </View>
        <ChevronRightIcon size={CHEVRON_SIZE} color={CHEVRON_COLOR} />
      </Pressable>
      <DayChips routineId={routine.id} />
    </View>
  );
};
