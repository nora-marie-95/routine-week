import { useState } from "react";
import { View } from "react-native";

import { categoryNames, resolveCategory } from "@/domains/routine";
import { useRoutines } from "@/domains/store";
import { Chip, TextField } from "@/shared/ui-kit";

type CategoryPickerProps = {
  value: string | undefined;
  onChange: (category: string | undefined) => void;
};

type CategoryChipProps = {
  name: string;
  selected: boolean;
  onSelect: (category: string) => void;
};

const CategoryChip = (props: CategoryChipProps) => {
  const { name, selected, onSelect } = props;
  const onPress = () => {
    onSelect(name);
  };
  return (
    <Chip label={name} selected={selected} onPress={onPress} testID={`category-chip-${name}`} />
  );
};

/** Optional grouping for a routine: pick an existing category, or type a new one. */
export const CategoryPicker = (props: CategoryPickerProps) => {
  const { value, onChange } = props;
  const routines = useRoutines();
  const [adding, setAdding] = useState(false);
  const existing = categoryNames(routines);
  /** A category chosen but not saved on any routine yet still needs a chip — once typing is done. */
  const isUnsaved = value !== undefined && !existing.includes(value);
  const names = isUnsaved && !adding ? [...existing, value] : existing;
  const onNonePress = () => {
    setAdding(false);
    onChange(undefined);
  };
  const onExistingSelect = (category: string) => {
    setAdding(false);
    onChange(category);
  };
  const onNewPress = () => {
    onChange(undefined);
    setAdding(true);
  };
  /** Applied as you type, so saving the routine without pressing Enter still keeps the name. */
  const onDraftChange = (draft: string) => {
    onChange(resolveCategory(draft, existing));
  };
  const onDraftSubmit = () => {
    setAdding(false);
  };
  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-2">
        <Chip
          label="No category"
          selected={value === undefined && !adding}
          onPress={onNonePress}
          testID="category-chip-none"
        />
        {names.map((name) => {
          return (
            <CategoryChip
              key={name}
              name={name}
              selected={value === name}
              onSelect={onExistingSelect}
            />
          );
        })}
        <Chip label="+ New" selected={adding} onPress={onNewPress} testID="category-chip-new" />
      </View>
      {adding ? (
        <TextField
          autoFocus
          onChangeText={onDraftChange}
          placeholder="Category name, e.g. Chores"
          onSubmitEditing={onDraftSubmit}
          testID="category-new-input"
        />
      ) : null}
    </View>
  );
};
