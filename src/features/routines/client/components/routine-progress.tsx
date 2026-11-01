import { useState } from "react";
import { Text, View } from "react-native";

import { CheckIcon } from "lucide-react-native";

import {
  type PeriodProgress,
  type Rhythm,
  type Routine,
  currentProgress,
  formatPeriod,
  isWeekSkipped,
  periodUnit,
  recentProgress,
  rhythmForWeek,
  withWeekRhythms,
} from "@/domains/routine";
import { useRoutineCompletions } from "@/domains/store";
import { weekStartOf } from "@/features/routines/client/week-offset";

type RoutineProgressProps = {
  routine: Routine;
};

type RoutineProgressLabelProps = {
  routine: Routine;
  /** Whole weeks after the current one, matching the week the day chips are showing. */
  weekOffset: number;
};

/** Read once per mount; a screen left open across a period boundary refreshes on next visit. */
const useCurrentTime = () => {
  const [at] = useState(Date.now);
  return at;
};

const HISTORY_PERIODS = 6;
const DAYS_PER_WEEK = 7;
const MET_COLOR = "#2BB673";

/** What the progress covers once the chips look ahead: a day-long period has no "next week". */
const unitFor = (rhythm: Rhythm, weekOffset: number) => {
  if (weekOffset === 0) {
    return periodUnit(rhythm);
  }
  if (rhythm.kind === "weekly" || rhythm.kind === "timesPerWeek") {
    return "next week";
  }
  return "in that period";
};

/** "2/3 this week" for the period in progress, with a green check once the target is met. */
export const RoutineProgressLabel = (props: RoutineProgressLabelProps) => {
  const { routine, weekOffset } = props;
  const completions = useRoutineCompletions(routine.id);
  const now = useCurrentTime();
  const weekStart = weekStartOf(weekOffset);
  const rhythm = rhythmForWeek(routine, weekStart);
  const { createdAt } = routine;
  if (isWeekSkipped(routine, weekStart)) {
    return (
      <Text testID={`routine-skipped-${routine.id}`} className="text-sm text-subtle">
        Skipped {weekOffset > 0 ? "next week" : "this week"}
      </Text>
    );
  }
  if (weekOffset > 0 && rhythm.kind === "daily") {
    return null;
  }
  const lookAhead = new Date(now);
  lookAhead.setDate(lookAhead.getDate() + weekOffset * DAYS_PER_WEEK);
  const at = lookAhead.getTime();
  const progress = currentProgress({ rhythm, createdAt, completions, at });
  const textClassName = progress.met ? "text-sm text-routine" : "text-sm text-subtle";
  return (
    <View testID={`routine-progress-${routine.id}`} className="flex-row items-center gap-1">
      {progress.met ? <CheckIcon size={14} color={MET_COLOR} strokeWidth={3} /> : null}
      <Text className={textClassName}>
        {progress.done}/{progress.target} {unitFor(rhythm, weekOffset)}
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
  const periods = withWeekRhythms(
    routine,
    recentProgress({ rhythm, createdAt, completions, at }, HISTORY_PERIODS),
  );
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">History</Text>
      {periods.map((period) => {
        return <HistoryRow key={period.start} rhythm={rhythm} period={period} />;
      })}
    </View>
  );
};
