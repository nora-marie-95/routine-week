import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react-native";

import { useTodoItemsForDay } from "@/domains/store";
import { sortTodoItems } from "@/domains/todo-item";
import { TodoRow } from "@/features/todos/client/components/todo-row";
import { Chip } from "@/shared/ui-kit";
import { type WeekDay, formatWeekRange, shiftDateKey, todayKey, weekDays } from "@/shared/util";

type WeekBoardProps = {
  /** Called with the day's "YYYY-MM-DD" when its + is tapped. */
  onAddToDay: (day: string) => void;
};

type DaySectionProps = {
  day: WeekDay;
  isToday: boolean;
  onAddToDay: (day: string) => void;
};

const DAYS_PER_WEEK = 7;
const ARROW_SIZE = 22;
const ADD_ICON_SIZE = 18;
const TODAY_COLOR = "#2BB673";

const DaySection = (props: DaySectionProps) => {
  const { day, isToday, onAddToDay } = props;
  const todoItems = useTodoItemsForDay(day.key);
  const onAddPress = () => {
    onAddToDay(day.key);
  };
  const headerClassName = isToday
    ? "text-sm font-semibold uppercase tracking-wide text-routine"
    : "text-sm font-semibold uppercase tracking-wide text-subtle";
  return (
    <View testID={`day-section-${day.key}`} className="pt-4">
      <View className="flex-row items-center justify-between border-b-hair border-hairline pb-2">
        <Text className={headerClassName}>
          {day.weekday} {day.dayOfMonth}
          {isToday ? " · Today" : ""}
        </Text>
        <Pressable
          hitSlop={8}
          onPress={onAddPress}
          testID={`add-to-day-${day.key}`}
          accessibilityLabel={`Add to ${day.weekday} ${day.dayOfMonth}`}
        >
          <PlusIcon size={ADD_ICON_SIZE} color={isToday ? TODAY_COLOR : "#8E8E93"} />
        </Pressable>
      </View>
      {todoItems.length === 0 ? (
        <Text className="py-3 text-sm text-subtle">Nothing planned</Text>
      ) : (
        sortTodoItems(todoItems).map((todoItem) => {
          return <TodoRow key={todoItem.id} todoItem={todoItem} />;
        })
      )}
    </View>
  );
};

/** One week, Monday to Sunday: browse weeks with the arrows, add to any day with its +. */
export const WeekBoard = (props: WeekBoardProps) => {
  const { onAddToDay } = props;
  const [weekAnchor, setWeekAnchor] = useState(todayKey);
  const today = todayKey();
  const days = weekDays(weekAnchor);
  const isThisWeek = days.some((day) => {
    return day.key === today;
  });
  const onPreviousWeekPress = () => {
    setWeekAnchor(shiftDateKey(weekAnchor, -DAYS_PER_WEEK));
  };
  const onNextWeekPress = () => {
    setWeekAnchor(shiftDateKey(weekAnchor, DAYS_PER_WEEK));
  };
  const onThisWeekPress = () => {
    setWeekAnchor(today);
  };
  return (
    <ScrollView className="flex-1" contentContainerClassName="px-4 pb-12">
      <View className="flex-row items-center justify-between pt-3">
        <Pressable
          hitSlop={8}
          onPress={onPreviousWeekPress}
          testID="week-previous"
          accessibilityLabel="Previous week"
        >
          <ChevronLeftIcon size={ARROW_SIZE} color="#1C1C1E" />
        </Pressable>
        <View className="items-center gap-1">
          <Text testID="week-range" className="text-base font-semibold text-ink">
            {formatWeekRange(days)}
          </Text>
          {isThisWeek ? null : (
            <Chip
              label="This week"
              selected={false}
              onPress={onThisWeekPress}
              testID="week-current"
            />
          )}
        </View>
        <Pressable
          hitSlop={8}
          onPress={onNextWeekPress}
          testID="week-next"
          accessibilityLabel="Next week"
        >
          <ChevronRightIcon size={ARROW_SIZE} color="#1C1C1E" />
        </Pressable>
      </View>
      {days.map((day) => {
        return (
          <DaySection key={day.key} day={day} isToday={day.key === today} onAddToDay={onAddToDay} />
        );
      })}
    </ScrollView>
  );
};
