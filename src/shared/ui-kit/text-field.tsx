import { TextInput, type TextInputProps } from "react-native";

type TextFieldProps = Pick<
  TextInputProps,
  "value" | "onChangeText" | "placeholder" | "autoFocus" | "onSubmitEditing" | "testID"
>;

export const TextField = (props: TextFieldProps) => {
  const { value, onChangeText, placeholder, autoFocus, onSubmitEditing, testID } = props;
  return (
    <TextInput
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8E8E93"
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="done"
      className="border-b-hair border-hairline px-1 py-2 text-base text-ink"
    />
  );
};
