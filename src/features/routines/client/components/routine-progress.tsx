import { useState } from "react";
import { Text, View } from "react-native";

import { CheckIcon } from "lucide-react-native";

import {
  type PeriodProgress,
  type Rhythm,
  type Routine,
  currentProgress,
  formatPeriod,
  periodUnit,
  recentProgress,
} from "@/domains/routine";
import { useRoutineCompletions } from "@/domains/store";

type RoutineProgressProps = {
  routine: Routine;
};

/** Read once per mount; a screen left open across a period boundary refreshes on next visit. */
const useCurrentTime = () => {
  const [at] = useState(Date.now);
  return at;
};

const HISTORY_PERIODS = 6;
const MET_COLOR = "#2BB673";

/** "2/3 this week" for the period in progress, with a green check once the target is met. */
export const RoutineProgressLabel = (props: RoutineProgressProps) => {
  const { routine } = props;
  const completions = useRoutineCompletions(routine.id);
  const at = useCurrentTime();
  const { rhythm, createdAt } = routine;
  const progress = currentProgress({ rhythm, createdAt, completions, at });
  const textClassName = progress.met ? "text-sm text-routine" : "text-sm text-subtle";
  return (
    <View testID={`routine-progress-${routine.id}`} className="flex-row items-center gap-1">
      {progress.met ? <CheckIcon size={14} color={MET_COLOR} strokeWidth={3} /> : null}
      <Text className={textClassName}>
        {progress.done}/{progress.target} {periodUnit(rhythm)}
      </Text>
    </View>
  );
};

type HistoryRowProps = {
  rhythm: Rhythm;
  period: PeriodProgress;
};

const HistoryRow = (props: HistoryRowProps) => {
  const { rhythm, period } = props;
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base text-ink">{formatPeriod(rhythm, period)}</Text>
      <View className="flex-row items-center gap-1">
        {period.met ? <CheckIcon size={14} color={MET_COLOR} strokeWidth={3} /> : null}
        <Text className={period.met ? "text-sm text-routine" : "text-sm text-subtle"}>
          {period.done}/{period.target}
        </Text>
      </View>
    </View>
  );
};

/** Recent periods, newest first, so you can see which ones you kept up. */
export const RoutineHistory = (props: RoutineProgressProps) => {
  const { routine } = props;
  const completions = useRoutineCompletions(routine.id);
  const at = useCurrentTime();
  const { rhythm, createdAt } = routine;
  const periods = recentProgress({ rhythm, createdAt, completions, at }, HISTORY_PERIODS);
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">History</Text>
      {periods.map((period) => {
        return <HistoryRow key={period.start} rhythm={rhythm} period={period} />;
      })}
    </View>
  );
};
