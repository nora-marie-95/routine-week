import { useState } from "react";
import { Text, View } from "react-native";

import type { Routine } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { CategoryPicker } from "@/features/routines/client/components/category-picker";
import { TextField } from "@/shared/ui-kit";

type RoutineDetailsProps = {
  routine: Routine;
};

/** Edits a saved routine's title and category in place — every change is stored immediately. */
export const RoutineDetails = (props: RoutineDetailsProps) => {
  const { routine } = props;
  const [title, setTitle] = useState(routine.title);
  const renameRoutine = useAppStore((state) => {
    return state.routine.rename;
  });
  const setCategory = useAppStore((state) => {
    return state.routine.setCategory;
  });
  /** A blank title is only kept while typing; the stored title stays the last non-blank one. */
  const onChangeTitle = (next: string) => {
    setTitle(next);
    const trimmed = next.trim();
    if (trimmed.length > 0) {
      renameRoutine(routine.id, trimmed);
    }
  };
  const onChangeCategory = (category: string | undefined) => {
    setCategory(routine.id, category);
  };
  return (
    <View className="gap-5">
      <TextField
        value={title}
        onChangeText={onChangeTitle}
        placeholder="Routine name"
        testID="routine-title-input"
      />
      <View className="gap-2">
        <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">Category</Text>
        <CategoryPicker value={routine.category} onChange={onChangeCategory} />
      </View>
    </View>
  );
};
