import { FlatList } from "react-native";

import type { Routine } from "@/domains/routine";
import { useRoutines } from "@/domains/store";
import { RoutineRow } from "@/features/routines/client/components/routine-row";
import { EmptyState } from "@/shared/ui-kit";

export const RoutineList = () => {
  const routines = useRoutines();
  const renderItem = (info: { item: Routine }) => {
    return <RoutineRow routine={info.item} />;
  };
  if (routines.length === 0) {
    return <EmptyState message="No routines yet — tap + to add one." />;
  }
  return (
    <FlatList
      className="flex-1"
      contentContainerClassName="px-4 pb-24"
      data={routines}
      keyExtractor={(item) => {
        return item.id;
      }}
      renderItem={renderItem}
    />
  );
};
