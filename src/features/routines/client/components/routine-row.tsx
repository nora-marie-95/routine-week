import { Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import { PencilIcon, Trash2Icon } from "lucide-react-native";

import { type Routine, formatRhythm } from "@/domains/routine";
import { useAppStore } from "@/domains/store";
import { CategoryPicker } from "@/features/routines/client/components/category-picker";
import { DayChips } from "@/features/routines/client/components/day-chips";
import { RoutineProgressLabel } from "@/features/routines/client/components/routine-progress";
import { useRoutineEditor } from "@/features/routines/client/hooks/use-routine-editor";
import { ComposerModal } from "@/shared/ui-kit";

type RoutineRowProps = {
  routine: Routine;
};

const ACTION_ICON_SIZE = 18;
const ACTION_ICON_COLOR = "#8E8E93";

export const RoutineRow = (props: RoutineRowProps) => {
  const { routine } = props;
  const removeRoutine = useAppStore((state) => {
    return state.routine.remove;
  });
  const editor = useRoutineEditor(routine);
  const onRemovePress = () => {
    editor.close();
    removeRoutine(routine.id);
  };
  const onPress = () => {
    router.push({ pathname: "/routine/[id]", params: { id: routine.id } });
  };
  return (
    <>
      <View
        testID={`routine-row-${routine.id}`}
        className="gap-3 border-b-hair border-hairline py-3"
      >
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onPress} testID={`routine-open-${routine.id}`} className="flex-1">
            <Text className="text-base text-ink">{routine.title}</Text>
            <Text className="text-sm text-subtle">{formatRhythm(routine.rhythm)}</Text>
            <RoutineProgressLabel routine={routine} />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={editor.open}
            testID={`routine-edit-${routine.id}`}
            accessibilityLabel="Edit"
          >
            <PencilIcon size={ACTION_ICON_SIZE} color={ACTION_ICON_COLOR} />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={onRemovePress}
            testID={`routine-delete-${routine.id}`}
            accessibilityLabel="Delete"
          >
            <Trash2Icon size={ACTION_ICON_SIZE} color={ACTION_ICON_COLOR} />
          </Pressable>
        </View>
        <DayChips routineId={routine.id} />
      </View>
      {/* Sibling, not child: clicks inside a web Modal bubble through the React tree to the row. */}
      <ComposerModal
        visible={editor.visible}
        label="Edit Routine"
        submitLabel="Save"
        value={editor.title}
        onChangeValue={editor.onChangeTitle}
        onSubmit={editor.submit}
        onClose={editor.close}
        onDelete={onRemovePress}
        testID={`routine-edit-input-${routine.id}`}
      >
        <CategoryPicker value={editor.category} onChange={editor.onChangeCategory} />
      </ComposerModal>
    </>
  );
};
