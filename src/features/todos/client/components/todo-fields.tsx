import { View } from "react-native";

import { DayPicker } from "@/features/todos/client/components/day-picker";
import { RoutinePicker } from "@/features/todos/client/components/routine-picker";

type TodoFieldsProps = {
  routineId: string | undefined;
  dueDate: string;
  onRoutineIdChange: (routineId: string | undefined) => void;
  onDueDateChange: (dueDate: string) => void;
};

/** The pickers shared by the "new todo" and "edit todo" sheets. */
export const TodoFields = (props: TodoFieldsProps) => {
  const { routineId, dueDate, onRoutineIdChange, onDueDateChange } = props;
  return (
    <View className="gap-4">
      <DayPicker value={dueDate} onChange={onDueDateChange} />
      <RoutinePicker value={routineId} onChange={onRoutineIdChange} />
    </View>
  );
};
