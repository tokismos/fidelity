import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  message?: string
}

export const ErrorView = ({ message }: Props) => (
  <View className="flex-1 items-center justify-center bg-gray-50 px-4">
    <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
    <Text className="mt-2 text-lg text-gray-700">Something went wrong.</Text>
    <Text className="mt-1 text-center text-sm text-gray-500">{message ?? "Please try again later."}</Text>
  </View>
)
