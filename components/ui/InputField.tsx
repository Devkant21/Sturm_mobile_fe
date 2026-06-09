import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends Omit<TextInputProps, "onChangeText"> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;

  error?: string;

  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;

  containerClassName?: string;
  inputContainerClassName?: string;
  inputClassName?: string;
}

export default function InputField({
  label,
  value,
  onChangeText,

  error,

  leftElement,
  rightElement,

  containerClassName = "",
  inputContainerClassName = "",
  inputClassName = "",

  ...textInputProps
}: InputFieldProps) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
      )}

      <View
        className={`
          flex-row items-center rounded-lg border bg-white px-4
          ${error ? "border-red-400" : "border-gray-200"}
          ${inputContainerClassName}
        `}
      >
        {leftElement}

        <TextInput
          className={`flex-1 py-2 text-lg tracking-[3px] text-gray-900 ${inputClassName}`}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          {...textInputProps}
        />

        {rightElement}
      </View>

      {error ? (
        <Text className="mt-2 text-xs text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}
