import { ScrollView } from "react-native";

import type { Routine } from "@/domains/routine";
import { useRoutines } from "@/domains/store";
import { Chip } from "@/shared/ui-kit";

type RoutineChipProps = {
  routine: Routine;
  selected: boolean;
  onSelect: (routineId: string) => void;
};

const RoutineChip = (props: RoutineChipProps) => {
  const { routine, selected, onSelect } = props;
  const onPress = () => {
    onSelect(routine.id);
  };
  return (
    <Chip
      label={routine.title}
      selected={selected}
      onPress={onPress}
      testID={`routine-chip-${routine.id}`}
    />
  );
};

type RoutinePickerProps = {
  value: string | undefined;
  onChange: (routineId: string | undefined) => void;
};

/** Lets a todo (re)link to a routine — "None" is a first-class choice. */
export const RoutinePicker = (props: RoutinePickerProps) => {
  const { value, onChange } = props;
  const routines = useRoutines();
  const onNonePress = () => {
    onChange(undefined);
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-2"
    >
      <Chip
        label="No routine"
        selected={value === undefined}
        onPress={onNonePress}
        testID="routine-chip-none"
      />
      {routines.map((routine) => {
        return (
          <RoutineChip
            key={routine.id}
            routine={routine}
            selected={value === routine.id}
            onSelect={onChange}
          />
        );
      })}
    </ScrollView>
  );
};
