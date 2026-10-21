import { Pressable, Text, View } from "react-native";

import { MinusIcon, PlusIcon } from "lucide-react-native";

import {
  DEFAULT_TIMES_PER_WEEK,
  MAX_TIMES_PER_WEEK,
  MIN_TIMES_PER_WEEK,
  type Rhythm,
} from "@/domains/routine";
import { Chip } from "@/shared/ui-kit";

type RhythmOption = {
  label: string;
  rhythm: Rhythm;
};

type RhythmPickerProps = {
  value: Rhythm | undefined;
  onChange: (rhythm: Rhythm) => void;
};

type TimesStepperProps = {
  times: number;
  onChange: (rhythm: Rhythm) => void;
};

const STEPPER_ICON_SIZE = 16;

const RHYTHM_OPTIONS: RhythmOption[] = [
  { label: "Daily", rhythm: { kind: "daily" } },
  { label: "Weekly", rhythm: { kind: "weekly" } },
  { label: "Every 2 weeks", rhythm: { kind: "biweekly" } },
  { label: "Monthly", rhythm: { kind: "monthly" } },
  { label: "X× a week", rhythm: { kind: "timesPerWeek", times: DEFAULT_TIMES_PER_WEEK } },
];

type RhythmChipProps = {
  option: RhythmOption;
  value: Rhythm | undefined;
  onChange: (rhythm: Rhythm) => void;
};

const RhythmChip = (props: RhythmChipProps) => {
  const { option, value, onChange } = props;
  const selected = value?.kind === option.rhythm.kind;
  const onPress = () => {
    // Re-tapping "X× a week" keeps the count the user already chose.
    onChange(selected && value ? value : option.rhythm);
  };
  return (
    <Chip
      label={option.label}
      selected={selected}
      onPress={onPress}
      testID={`rhythm-chip-${option.rhythm.kind}`}
    />
  );
};

const TimesStepper = (props: TimesStepperProps) => {
  const { times, onChange } = props;
  const onDecrease = () => {
    onChange({ kind: "timesPerWeek", times: Math.max(MIN_TIMES_PER_WEEK, times - 1) });
  };
  const onIncrease = () => {
    onChange({ kind: "timesPerWeek", times: Math.min(MAX_TIMES_PER_WEEK, times + 1) });
  };
  return (
    <View className="flex-row items-center gap-4">
      <Pressable
        hitSlop={8}
        onPress={onDecrease}
        testID="rhythm-times-decrease"
        accessibilityLabel="Fewer times per week"
      >
        <MinusIcon size={STEPPER_ICON_SIZE} color="#1C1C1E" />
      </Pressable>
      <Text testID="rhythm-times-value" className="text-base text-ink">
        {times}× a week
      </Text>
      <Pressable
        hitSlop={8}
        onPress={onIncrease}
        testID="rhythm-times-increase"
        accessibilityLabel="More times per week"
      >
        <PlusIcon size={STEPPER_ICON_SIZE} color="#1C1C1E" />
      </Pressable>
    </View>
  );
};

/** Pick how often a routine repeats; "X× a week" reveals a stepper for the count. */
export const RhythmPicker = (props: RhythmPickerProps) => {
  const { value, onChange } = props;
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {RHYTHM_OPTIONS.map((option) => {
          return (
            <RhythmChip
              key={option.rhythm.kind}
              option={option}
              value={value}
              onChange={onChange}
            />
          );
        })}
      </View>
      {value?.kind === "timesPerWeek" ? (
        <TimesStepper times={value.times} onChange={onChange} />
      ) : null}
    </View>
  );
};
