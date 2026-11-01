import { View } from "react-native";

import { Chip } from "@/shared/ui-kit";

type WeekSwitchProps = {
  /** 0 is the current week, 1 is the next one. */
  weekOffset: number;
  onChange: (weekOffset: number) => void;
};

/** Chooses which week the day chips plan into — plan ahead without touching the current week. */
export const WeekSwitch = (props: WeekSwitchProps) => {
  const { weekOffset, onChange } = props;
  const onThisWeekPress = () => {
    onChange(0);
  };
  const onNextWeekPress = () => {
    onChange(1);
  };
  return (
    <View className="flex-row gap-2">
      <Chip
        label="This week"
        selected={weekOffset === 0}
        onPress={onThisWeekPress}
        testID="week-switch-this"
      />
      <Chip
        label="Next week"
        selected={weekOffset === 1}
        onPress={onNextWeekPress}
        testID="week-switch-next"
      />
    </View>
  );
};
