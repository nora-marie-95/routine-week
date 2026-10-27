import { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";

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
  const allTodoItems = useTodayTodoItems(todayKey());
  const routines = useRoutines();
  const [showDone, setShowDone] = useState(false);
  const todoItems = allTodoItems.filter((todoItem) => {
    return !todoItem.done;
  });
  const doneItems = allTodoItems.filter((todoItem) => {
    return todoItem.done;
  });
  const groups = groupTodoItems(todoItems, routines);
  const onToggleDone = () => {
    setShowDone(!showDone);
  };
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
  if (allTodoItems.length === 0) {
    return <EmptyState message="Nothing planned for today — tap + to add a todo." />;
  }
  /** Finished todos tuck away at the bottom so the open ones stay in view. */
  const footer =
    doneItems.length > 0 ? (
      <View>
        <Pressable onPress={onToggleDone} testID="toggle-done" className="py-4">
          <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">
            {showDone ? "Hide" : "Show"} done ({doneItems.length})
          </Text>
        </Pressable>
        {showDone
          ? doneItems.map((todoItem) => {
              return <TodoRow key={todoItem.id} todoItem={todoItem} />;
            })
          : null}
      </View>
    ) : undefined;
  const header = todoItems.length === 0 ? <EmptyState message="All done for today." /> : undefined;
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
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      stickySectionHeadersEnabled={false}
    />
  );
};
