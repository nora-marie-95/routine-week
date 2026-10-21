import { TodayList, TodoFields, useTodoComposer } from "@/features/todos";
import { ComposerModal, Fab, Screen } from "@/shared/ui-kit";
import { todayKey } from "@/shared/util";

/** ink, matching tailwind.config.js colors.ink — this screen isn't scoped to a routine. */
const TODAY_FAB_COLOR = "#1C1C1E";

export const TodayScreen = () => {
  const composer = useTodoComposer();
  const onFabPress = () => {
    composer.openOn(todayKey());
  };
  return (
    <Screen>
      <TodayList />
      <Fab accentColor={TODAY_FAB_COLOR} onPress={onFabPress} testID="add-todo-fab" />
      <ComposerModal
        visible={composer.visible}
        label="New Todo"
        value={composer.title}
        onChangeValue={composer.onChangeTitle}
        onSubmit={composer.submit}
        onClose={composer.close}
        testID="add-todo-input"
      >
        <TodoFields
          routineId={composer.routineId}
          dueDate={composer.dueDate}
          onRoutineIdChange={composer.onChangeRoutineId}
          onDueDateChange={composer.onChangeDueDate}
        />
      </ComposerModal>
    </Screen>
  );
};
