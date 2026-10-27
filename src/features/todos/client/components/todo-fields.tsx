import { Pressable, Text, View } from "react-native";

import { DayPicker } from "@/features/todos/client/components/day-picker";
import { RoutinePicker } from "@/features/todos/client/components/routine-picker";
import { todayKey } from "@/shared/util";

type TodoFieldsProps = {
  routineId: string | undefined;
  dueDate: string;
  onRoutineIdChange: (routineId: string | undefined) => void;
  onDueDateChange: (dueDate: string) => void;
  /** When set, the pickers stay hidden behind a one-line summary until it is pressed. */
  collapsed?: boolean;
  onExpand?: () => void;
};

const describeDay = (dueDate: string) => {
  if (dueDate === todayKey()) {
    return "Today";
  }
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/** The pickers shared by the "new todo" and "edit todo" sheets. */
export const TodoFields = (props: TodoFieldsProps) => {
  const { routineId, dueDate, onRoutineIdChange, onDueDateChange, collapsed, onExpand } = props;
  if (collapsed) {
    return (
      <Pressable onPress={onExpand} testID="todo-more-options" accessibilityRole="button">
        <Text className="text-sm text-subtle">
          {describeDay(dueDate)} · <Text className="underline">Change day or routine</Text>
        </Text>
      </Pressable>
    );
  }
  return (
    <View className="gap-4">
      <DayPicker value={dueDate} onChange={onDueDateChange} />
      <RoutinePicker value={routineId} onChange={onRoutineIdChange} />
    </View>
  );
};
