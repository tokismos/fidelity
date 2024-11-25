import { Text, TextInput, TextInputProps, View } from "react-native"

export const FormField = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  defaultValue,
}: TextInputProps & { label: string }) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
    <TextInput
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      className="rounded-md border border-gray-300 p-2"
      keyboardType={keyboardType}
    />
  </View>
)
