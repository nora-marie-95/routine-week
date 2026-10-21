import { Text, View } from "react-native";

import type { Rhythm } from "@/domains/routine";
import { useAppStore, useRoutine } from "@/domains/store";
import { RhythmPicker } from "@/features/routines/client/components/rhythm-picker";

type RoutineRhythmProps = {
  routineId: string;
};

/** Edits a saved routine's rhythm in place — every change is stored immediately. */
export const RoutineRhythm = (props: RoutineRhythmProps) => {
  const { routineId } = props;
  const routine = useRoutine(routineId);
  const setRhythm = useAppStore((state) => {
    return state.routine.setRhythm;
  });
  const onChange = (rhythm: Rhythm) => {
    setRhythm(routineId, rhythm);
  };
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">Rhythm</Text>
      <RhythmPicker value={routine?.rhythm} onChange={onChange} />
    </View>
  );
};
