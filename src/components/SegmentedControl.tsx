import { Pressable, Text, View } from "react-native"

type Option<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export const SegmentedControl = <T extends string>({ options, value, onChange }: Props<T>) => (
  <View className="flex-row rounded-xl bg-gray-200 p-1">
    {options.map((option) => (
      <Pressable
        key={option.value}
        onPress={() => onChange(option.value)}
        className={`flex-1 rounded-lg py-2 ${option.value === value ? "bg-white" : ""}`}
      >
        <Text className={`text-center font-medium ${option.value === value ? "text-gray-900" : "text-gray-500"}`}>
          {option.label}
        </Text>
      </Pressable>
    ))}
  </View>
)
