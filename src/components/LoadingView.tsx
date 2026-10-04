import { colors } from "@/constants/colors"
import { ActivityIndicator, Text, View } from "react-native"

type Props = {
  message?: string
}

export const LoadingView = ({ message }: Props) => (
  <View className="flex-1 items-center justify-center bg-gray-50">
    <ActivityIndicator size="large" color={colors.primary} />
    {message && <Text className="mt-2 text-lg text-gray-700">{message}</Text>}
  </View>
)
