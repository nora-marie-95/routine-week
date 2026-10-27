import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import { useUndoStore } from "@/shared/undo/use-undo-store";

const VISIBLE_MS = 6000;

/** "Deleted … Undo" bar, shown above the tab bar for a few seconds after a deletion. */
export const UndoToast = () => {
  const pending = useUndoStore((state) => {
    return state.pending;
  });
  const dismiss = useUndoStore((state) => {
    return state.dismiss;
  });
  const key = pending?.key;
  useEffect(() => {
    if (key === undefined) {
      return undefined;
    }
    const timer = setTimeout(dismiss, VISIBLE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [key, dismiss]);
  if (!pending) {
    return null;
  }
  const onUndoPress = () => {
    pending.undo();
    dismiss();
  };
  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-24 items-center px-4">
      <View
        testID="undo-toast"
        className="w-full max-w-md flex-row items-center justify-between rounded-xl bg-ink px-4 py-3"
      >
        <Text className="flex-1 text-white">{pending.message}</Text>
        <Pressable onPress={onUndoPress} testID="undo-button" hitSlop={8} className="pl-4">
          <Text className="font-semibold text-white">Undo</Text>
        </Pressable>
      </View>
    </View>
  );
};
