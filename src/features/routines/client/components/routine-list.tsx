import { useState } from "react";
import { SectionList, Text, View } from "react-native";

import { type Routine, type RoutineGroup, groupRoutines } from "@/domains/routine";
import { useRoutines } from "@/domains/store";
import { RoutineRow } from "@/features/routines/client/components/routine-row";
import { WeekSwitch } from "@/features/routines/client/components/week-switch";
import { EmptyState } from "@/shared/ui-kit";

type SectionHeaderInfo = {
  section: RoutineGroup;
};

/** px-4 / pb-24 as a style: NativeWind doesn't map contentContainerClassName on SectionList. */
const LIST_PADDING = { paddingHorizontal: 16, paddingBottom: 96 };

export const RoutineList = () => {
  const routines = useRoutines();
  const [weekOffset, setWeekOffset] = useState(0);
  const groups = groupRoutines(routines);
  /** Headers only appear once at least one routine has a category; otherwise it's a plain list. */
  const isGrouped = groups.some((group) => {
    return group.title !== undefined;
  });
  const renderItem = (info: { item: Routine }) => {
    return <RoutineRow routine={info.item} weekOffset={weekOffset} />;
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
  const header = (
    <View className="pt-3">
      <WeekSwitch weekOffset={weekOffset} onChange={setWeekOffset} />
    </View>
  );
  if (routines.length === 0) {
    return (
      <EmptyState message="No routines yet — tap + to add one, then plan it onto days of the week." />
    );
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
      ListHeaderComponent={header}
      stickySectionHeadersEnabled={false}
    />
  );
};
