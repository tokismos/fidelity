import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { ActivityIndicator, View } from "react-native"

type Props = {
  message?: string
}

export const LoadingView = ({ message }: Props) => (
  <View className="flex-1 items-center justify-center bg-ground px-8">
    <ActivityIndicator size="large" color={colors.ink} />
    {message && <AppText className="mt-3 text-center text-ink-2">{message}</AppText>}
  </View>
)
