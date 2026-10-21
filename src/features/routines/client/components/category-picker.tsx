import { useState } from "react";
import { ScrollView, View } from "react-native";

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
  const [draft, setDraft] = useState("");
  const existing = categoryNames(routines);
  /** A category typed but not saved on any routine yet still needs a chip to show it's chosen. */
  const names = value !== undefined && !existing.includes(value) ? [...existing, value] : existing;
  const onNonePress = () => {
    onChange(undefined);
  };
  const onNewPress = () => {
    setAdding(true);
  };
  const onDraftSubmit = () => {
    const category = resolveCategory(draft, existing);
    if (category !== undefined) {
      onChange(category);
    }
    setDraft("");
    setAdding(false);
  };
  return (
    <View className="gap-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center gap-2"
      >
        <Chip
          label="No category"
          selected={value === undefined}
          onPress={onNonePress}
          testID="category-chip-none"
        />
        {names.map((name) => {
          return (
            <CategoryChip key={name} name={name} selected={value === name} onSelect={onChange} />
          );
        })}
        <Chip label="+ New" selected={false} onPress={onNewPress} testID="category-chip-new" />
      </ScrollView>
      {adding ? (
        <TextField
          autoFocus
          value={draft}
          onChangeText={setDraft}
          placeholder="Category name, e.g. Chores"
          onSubmitEditing={onDraftSubmit}
          testID="category-new-input"
        />
      ) : null}
    </View>
  );
};
