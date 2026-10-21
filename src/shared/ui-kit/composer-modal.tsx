import { Modal, Pressable, Text, View } from "react-native";

import { TextField } from "@/shared/ui-kit/text-field";

type ComposerModalProps = {
  visible: boolean;
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  /** Defaults to "Add"; editors pass "Save". */
  submitLabel?: string;
  /** When set, a Delete button shows next to Cancel (editing an existing item). */
  onDelete?: () => void;
  children?: React.ReactNode;
  testID?: string;
};

export const ComposerModal = (props: ComposerModalProps) => {
  const {
    visible,
    label,
    value,
    onChangeValue,
    onSubmit,
    onClose,
    submitLabel = "Add",
    onDelete,
    children,
    testID,
  } = props;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/30" onPress={onClose} />
        <View className="gap-3 rounded-t-2xl bg-canvas p-4 pb-8">
          <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">{label}</Text>
          <TextField
            testID={testID}
            value={value}
            onChangeText={onChangeValue}
            placeholder="Title"
            autoFocus
            onSubmitEditing={onSubmit}
          />
          {children}
          <View className="flex-row items-center justify-end gap-3 pt-2">
            {onDelete ? (
              <Pressable onPress={onDelete} testID="delete-button" className="mr-auto px-4 py-2">
                <Text className="text-red-600">Delete</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={onClose} className="px-4 py-2">
              <Text className="text-subtle">Cancel</Text>
            </Pressable>
            <Pressable onPress={onSubmit} className="rounded-full bg-ink px-4 py-2">
              <Text className="font-medium text-white">{submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
