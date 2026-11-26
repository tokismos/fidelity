import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

type Props = {
  message?: string
}

export const ErrorView = ({ message }: Props) => (
  <View className="flex-1 items-center justify-center bg-ground px-8">
    <View className="h-14 w-14 items-center justify-center rounded-full bg-sunk">
      <Ionicons name="alert-circle-outline" size={28} color={colors.ink} />
    </View>
    <AppText weight="bold" className="mt-3 text-center text-[18px]">
      Something went wrong.
    </AppText>
    <AppText className="mt-1 text-center text-ink-2">{message ?? "Please try again later."}</AppText>
  </View>
)
