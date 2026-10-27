import { Pressable, Text, View } from "react-native";

import { useAppStore, useRoutine } from "@/domains/store";
import type { TodoItem } from "@/domains/todo-item";
import { TodoFields } from "@/features/todos/client/components/todo-fields";
import { useTodoEditor } from "@/features/todos/client/hooks/use-todo-editor";
import { Checkbox, ComposerModal } from "@/shared/ui-kit";
import { todayKey } from "@/shared/util";

type TodoRowProps = {
  todoItem: TodoItem;
};

/** Things' pattern: the linked routine is a plain gray subtitle, not a badge. */
export const TodoRow = (props: TodoRowProps) => {
  const { todoItem } = props;
  const toggleTodo = useAppStore((state) => {
    return state.todo.toggle;
  });
  const removeTodo = useAppStore((state) => {
    return state.todo.remove;
  });
  const routine = useRoutine(todoItem.routineId);
  const editor = useTodoEditor(todoItem);
  const onToggle = () => {
    toggleTodo(todoItem.id);
  };
  const onRemovePress = () => {
    removeTodo(todoItem.id);
  };
  const isOverdue = !todoItem.done && todoItem.dueDate < todayKey();
  /** A todo added straight from its routine carries the same name — repeating it adds nothing. */
  const showsRoutine = routine !== undefined && routine.title !== todoItem.title;
  const titleClassName = todoItem.done
    ? "text-base text-subtle line-through"
    : "text-base text-ink";
  return (
    <View
      testID={`todo-row-${todoItem.id}`}
      className="flex-row items-center gap-3 border-b-hair border-hairline py-3"
    >
      <Checkbox
        checked={todoItem.done}
        onToggle={onToggle}
        testID={`todo-checkbox-${todoItem.id}`}
      />
      <Pressable
        onPress={editor.open}
        testID={`todo-edit-${todoItem.id}`}
        accessibilityRole="button"
        accessibilityLabel="Edit todo"
        className="flex-1"
      >
        <Text className={titleClassName}>{todoItem.title}</Text>
        {isOverdue ? <Text className="text-sm text-red-600">Overdue</Text> : null}
        {showsRoutine ? <Text className="text-sm text-subtle">{routine.title}</Text> : null}
      </Pressable>
      <ComposerModal
        visible={editor.visible}
        label="Edit Todo"
        submitLabel="Save"
        value={editor.title}
        onChangeValue={editor.onChangeTitle}
        onSubmit={editor.submit}
        onClose={editor.close}
        onDelete={onRemovePress}
        testID={`todo-edit-input-${todoItem.id}`}
      >
        <TodoFields
          routineId={editor.routineId}
          dueDate={editor.dueDate}
          onRoutineIdChange={editor.onChangeRoutineId}
          onDueDateChange={editor.onChangeDueDate}
        />
      </ComposerModal>
    </View>
  );
};
