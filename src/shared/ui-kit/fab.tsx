import { Pressable } from "react-native";

import { PlusIcon } from "lucide-react-native";

type FabProps = {
  onPress: () => void;
  accentColor: string;
  testID?: string;
};

/** The single floating "+" — Things' one strong-color affordance per screen. */
export const Fab = (props: FabProps) => {
  const { onPress, accentColor, testID } = props;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={{ backgroundColor: accentColor }}
      className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg active:opacity-80"
    >
      <PlusIcon size={26} color="white" strokeWidth={2.5} />
    </Pressable>
  );
};
