import { Text, TextInput, TextInputProps, View } from "react-native"

type Props = TextInputProps & {
  label: string
}

export const FormField = ({ label, multiline, ...inputProps }: Props) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-semibold text-gray-700">{label}</Text>
    <TextInput
      {...inputProps}
      multiline={multiline}
      className={`rounded-lg border border-gray-300 bg-white px-4 py-3 text-base ${multiline ? "min-h-20" : ""}`}
    />
  </View>
)
