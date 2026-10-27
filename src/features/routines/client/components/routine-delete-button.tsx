import { Pressable, Text } from "react-native";

import { router } from "expo-router";

import type { Routine } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { useUndoStore } from "@/shared/undo";

type RoutineDeleteButtonProps = {
  routine: Routine;
};

export const RoutineDeleteButton = (props: RoutineDeleteButtonProps) => {
  const { routine } = props;
  const removeRoutine = useAppStore((state) => {
    return state.routine.remove;
  });
  const restoreRoutine = useAppStore((state) => {
    return state.routine.restore;
  });
  const offerUndo = useUndoStore((state) => {
    return state.offer;
  });
  const onPress = () => {
    const todoIds = useAppStore
      .getState()
      .todoItems.filter((todoItem) => {
        return todoItem.routineId === routine.id;
      })
      .map((todoItem) => {
        return todoItem.id;
      });
    removeRoutine(routine.id);
    offerUndo(`Deleted "${routine.title}"`, () => {
      restoreRoutine(routine, todoIds);
    });
    router.back();
  };
  return (
    <Pressable
      onPress={onPress}
      testID="routine-delete"
      accessibilityRole="button"
      className="py-2"
    >
      <Text className="text-base text-red-500">Delete routine</Text>
    </Pressable>
  );
};
