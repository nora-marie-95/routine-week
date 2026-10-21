import { TodoFields, WeekBoard, useTodoComposer } from "@/features/todos";
import { ComposerModal, Screen } from "@/shared/ui-kit";

export const WeekScreen = () => {
  const composer = useTodoComposer();
  return (
    <Screen>
      <WeekBoard onAddToDay={composer.openOn} />
      <ComposerModal
        visible={composer.visible}
        label="New Todo"
        value={composer.title}
        onChangeValue={composer.onChangeTitle}
        onSubmit={composer.submit}
        onClose={composer.close}
        testID="add-week-todo-input"
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
