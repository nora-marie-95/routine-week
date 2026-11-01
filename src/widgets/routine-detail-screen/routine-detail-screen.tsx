import { useState } from "react";
import { View } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

import { useRoutine } from "@/domains/store";
import {
  DayChips,
  RoutineDeleteButton,
  RoutineDetails,
  RoutineHistory,
  RoutineRhythm,
  WeekSwitch,
} from "@/features/routines";
import { EmptyState, Screen } from "@/shared/ui-kit";

export const RoutineDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useRoutine(id);
  const [weekOffset, setWeekOffset] = useState(0);

  if (!routine) {
    return (
      <Screen>
        <EmptyState message="This routine was deleted." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: routine.title }} />
      <View className="gap-5 px-4 pt-4">
        <RoutineDetails routine={routine} />
        <View className="gap-2">
          <WeekSwitch weekOffset={weekOffset} onChange={setWeekOffset} />
          <DayChips routineId={routine.id} weekOffset={weekOffset} />
        </View>
        <RoutineRhythm routineId={routine.id} />
        <RoutineHistory routine={routine} />
        <RoutineDeleteButton routine={routine} />
      </View>
    </Screen>
  );
};
