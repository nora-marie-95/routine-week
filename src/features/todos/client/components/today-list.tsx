import { FlatList } from "react-native";

import { useTodayTodoItems } from "@/domains/store";
import { type TodoItem, sortTodoItems } from "@/domains/todo-item";
import { TodoRow } from "@/features/todos/client/components/todo-row";
import { EmptyState } from "@/shared/ui-kit";
import { todayKey } from "@/shared/util";

export const TodayList = () => {
  const todoItems = useTodayTodoItems(todayKey());
  const renderItem = (info: { item: TodoItem }) => {
    return <TodoRow todoItem={info.item} />;
  };
  if (todoItems.length === 0) {
    return <EmptyState message="Nothing planned for today — tap + to add a todo." />;
  }
  return (
    <FlatList
      className="flex-1"
      contentContainerClassName="px-4 pb-24"
      data={sortTodoItems(todoItems)}
      keyExtractor={(item) => {
        return item.id;
      }}
      renderItem={renderItem}
    />
  );
};
