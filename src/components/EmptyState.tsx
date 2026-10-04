import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Text, View } from "react-native"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  title: string
  message?: string
}

export const EmptyState = ({ icon, title, message }: Props) => (
  <View className="items-center px-6 py-10">
    <Ionicons name={icon} size={48} color={colors.muted} />
    <Text className="mt-2 text-lg font-medium text-gray-600">{title}</Text>
    {message && <Text className="mt-1 text-center text-sm text-gray-500">{message}</Text>}
  </View>
)
