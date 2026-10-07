import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, TextInput, View } from "react-native"

type Props = {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  step?: number
}

// A number field with minus and plus buttons, typing is still possible
export const NumberStepper = ({ label, hint, value, onChange, step = 1 }: Props) => {
  const current = Number(value) || 0
  const change = (delta: number) => onChange(String(Math.max(0, current + delta)))

  return (
    <View className="mb-4 flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
        {hint && <Text className="text-xs text-gray-500">{hint}</Text>}
      </View>
      <View className="flex-row items-center">
        <Pressable
          onPress={() => change(-step)}
          accessibilityLabel={`Less ${label}`}
          className="h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
        >
          <Ionicons name="remove" size={20} color={colors.ink} />
        </Pressable>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          accessibilityLabel={label}
          className="w-14 text-center text-xl font-extrabold text-gray-900"
        />
        <Pressable
          onPress={() => change(step)}
          accessibilityLabel={`More ${label}`}
          className="h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
        >
          <Ionicons name="add" size={20} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  )
}
