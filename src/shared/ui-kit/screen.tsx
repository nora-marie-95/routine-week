import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
};

export const Screen = (props: ScreenProps) => {
  const { children } = props;
  return <SafeAreaView className="flex-1 bg-canvas">{children}</SafeAreaView>;
};
