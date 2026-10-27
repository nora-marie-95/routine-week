import { Pressable, Text } from "react-native";

import { router } from "expo-router";

import { useAppStore } from "@/domains/store";

type RoutineDeleteButtonProps = {
  routineId: string;
};

export const RoutineDeleteButton = (props: RoutineDeleteButtonProps) => {
  const { routineId } = props;
  const removeRoutine = useAppStore((state) => {
    return state.routine.remove;
  });
  const onPress = () => {
    removeRoutine(routineId);
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
