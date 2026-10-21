import { Text, View } from "react-native";

type EmptyStateProps = {
  message: string;
};

export const EmptyState = (props: EmptyStateProps) => {
  const { message } = props;
  return (
    <View className="items-center justify-center px-8 py-16">
      <Text className="text-center text-subtle">{message}</Text>
    </View>
  );
};
