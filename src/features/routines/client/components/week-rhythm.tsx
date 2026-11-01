import { Pressable, Text, View } from "react-native";

import { type Rhythm, type Routine, formatRhythm, isWeekSkipped } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { RhythmPicker } from "@/features/routines/client/components/rhythm-picker";
import { weekStartOf } from "@/features/routines/client/week-offset";

type WeekRhythmProps = {
  routine: Routine;
  /** Whole weeks after the current one, matching the week the day chips are showing. */
  weekOffset: number;
};

/** A one-off rhythm covers a single week, so only the week-sized choices make sense. */
const WEEK_RHYTHM_KINDS: Rhythm["kind"][] = ["weekly", "timesPerWeek"];

/** "Just this week it's once instead of twice": a rhythm for the shown week only. */
export const WeekRhythm = (props: WeekRhythmProps) => {
  const { routine, weekOffset } = props;
  const setWeekRhythm = useAppStore((state) => {
    return state.routine.setWeekRhythm;
  });
  const weekStart = weekStartOf(weekOffset);
  const weekName = weekOffset > 0 ? "next week" : "this week";
  const override = routine.rhythmOverrides?.[weekStart];
  const onChangePress = () => {
    setWeekRhythm(routine.id, weekStart, routine.rhythm);
  };
  const onResetPress = () => {
    setWeekRhythm(routine.id, weekStart, undefined);
  };
  const onRhythmChange = (rhythm: Rhythm) => {
    setWeekRhythm(routine.id, weekStart, rhythm);
  };
  if (isWeekSkipped(routine, weekStart)) {
    return null;
  }
  if (override) {
    return (
      <View testID="week-rhythm" className="gap-3 rounded-xl bg-black/5 p-3">
        <Text className="text-sm text-subtle">
          Only {weekName}: <Text className="text-ink">{formatRhythm(override)}</Text>
        </Text>
        <RhythmPicker
          value={override}
          onChange={onRhythmChange}
          kinds={WEEK_RHYTHM_KINDS}
          testIDPrefix="week-rhythm"
        />
        <Pressable onPress={onResetPress} testID="week-rhythm-reset" accessibilityRole="button">
          <Text className="text-sm text-ink underline">
            Back to usual ({formatRhythm(routine.rhythm)})
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onChangePress}
      testID="week-rhythm-change"
      accessibilityRole="button"
      className="rounded-xl bg-black/5 px-4 py-3"
    >
      <Text className="text-base font-medium text-ink">Different rhythm {weekName}</Text>
      <Text className="text-sm text-subtle">Usually {formatRhythm(routine.rhythm)}</Text>
    </Pressable>
  );
};
