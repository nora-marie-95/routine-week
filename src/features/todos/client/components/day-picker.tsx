import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";

import { Chip } from "@/shared/ui-kit";
import { formatWeekRange, shiftDateKey, weekDays } from "@/shared/util";

type DayPickerProps = {
  value: string;
  onChange: (dueDate: string) => void;
};

type DayOptionProps = {
  dayKey: string;
  label: string;
  selected: boolean;
  onChange: (dueDate: string) => void;
};

const WEEK_ARROW_SIZE = 18;
const DAYS_PER_WEEK = 7;

const DayOption = (props: DayOptionProps) => {
  const { dayKey, label, selected, onChange } = props;
  const onPress = () => {
    onChange(dayKey);
  };
  return (
    <Chip label={label} selected={selected} onPress={onPress} testID={`day-option-${dayKey}`} />
  );
};

/** Picks the day a todo is planned for, one week at a time (it opens on the todo's own week). */
export const DayPicker = (props: DayPickerProps) => {
  const { value, onChange } = props;
  const [weekAnchor, setWeekAnchor] = useState(value);
  const days = weekDays(weekAnchor);
  const onPreviousWeekPress = () => {
    setWeekAnchor(shiftDateKey(weekAnchor, -DAYS_PER_WEEK));
  };
  const onNextWeekPress = () => {
    setWeekAnchor(shiftDateKey(weekAnchor, DAYS_PER_WEEK));
  };
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Pressable
          hitSlop={8}
          onPress={onPreviousWeekPress}
          testID="day-picker-previous"
          accessibilityLabel="Previous week"
        >
          <ChevronLeftIcon size={WEEK_ARROW_SIZE} color="#1C1C1E" />
        </Pressable>
        <Text className="text-sm text-subtle">{formatWeekRange(days)}</Text>
        <Pressable
          hitSlop={8}
          onPress={onNextWeekPress}
          testID="day-picker-next"
          accessibilityLabel="Next week"
        >
          <ChevronRightIcon size={WEEK_ARROW_SIZE} color="#1C1C1E" />
        </Pressable>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {days.map((day) => {
          return (
            <DayOption
              key={day.key}
              dayKey={day.key}
              label={`${day.weekday} ${day.dayOfMonth}`}
              selected={day.key === value}
              onChange={onChange}
            />
          );
        })}
      </View>
    </View>
  );
};
