import { SectionList, Text } from "react-native";

import { type TodoGroup, groupTodoItems, useRoutines, useTodayTodoItems } from "@/domains/store";
import type { TodoItem } from "@/domains/todo-item";
import { TodoRow } from "@/features/todos/client/components/todo-row";
import { EmptyState } from "@/shared/ui-kit";
import { todayKey } from "@/shared/util";

type SectionHeaderInfo = {
  section: TodoGroup;
};

/** px-4 / pb-24 as a style: NativeWind doesn't map contentContainerClassName on SectionList. */
const LIST_PADDING = { paddingHorizontal: 16, paddingBottom: 96 };

export const TodayList = () => {
  const todoItems = useTodayTodoItems(todayKey());
  const routines = useRoutines();
  const groups = groupTodoItems(todoItems, routines);
  /** Headers only appear once at least one todo has a category; otherwise it's a plain list. */
  const isGrouped = groups.some((group) => {
    return group.title !== undefined;
  });
  const renderItem = (info: { item: TodoItem }) => {
    return <TodoRow todoItem={info.item} />;
  };
  const renderSectionHeader = (info: SectionHeaderInfo) => {
    if (!isGrouped) {
      return null;
    }
    return (
      <Text className="bg-canvas pb-1 pt-4 text-sm font-semibold uppercase tracking-wide text-subtle">
        {info.section.title ?? "No category"}
      </Text>
    );
  };
  if (todoItems.length === 0) {
    return <EmptyState message="Nothing planned for today — tap + to add a todo." />;
  }
  return (
    <SectionList
      className="flex-1"
      contentContainerStyle={LIST_PADDING}
      sections={groups}
      keyExtractor={(item) => {
        return item.id;
      }}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
    />
  );
};
