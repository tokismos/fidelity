import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Text, View } from "react-native"

type Props = {
  label: string
  value: number | string
  icon: ComponentProps<typeof Ionicons>["name"]
}

export const StatCard = ({ label, value, icon }: Props) => (
  <View className="flex-1 rounded-xl bg-white p-3 shadow-sm">
    <Ionicons name={icon} size={20} color={colors.primary} />
    <Text className="mt-1 text-xl font-bold text-gray-900">{value}</Text>
    <Text className="text-xs text-gray-500">{label}</Text>
  </View>
)
