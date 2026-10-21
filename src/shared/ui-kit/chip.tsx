import { Pressable, Text } from "react-native";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

export const Chip = (props: ChipProps) => {
  const { label, selected, onPress, testID } = props;
  const chipClassName = selected
    ? "rounded-full border-hair border-hairline bg-ink px-3 py-1.5"
    : "rounded-full border-hair border-hairline bg-transparent px-3 py-1.5";
  return (
    <Pressable testID={testID} onPress={onPress} className={chipClassName}>
      <Text className={selected ? "text-sm text-white" : "text-sm text-ink"}>{label}</Text>
    </Pressable>
  );
};
