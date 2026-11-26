import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { View } from "react-native"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  title: string
  message?: string
}

export const EmptyState = ({ icon, title, message }: Props) => (
  <View className="items-center px-[30px] py-10">
    <View className="h-14 w-14 items-center justify-center rounded-full bg-sunk">
      <Ionicons name={icon} size={28} color={colors.ink2} />
    </View>
    <AppText weight="bold" className="mb-1 mt-3 text-center text-[18px]">
      {title}
    </AppText>
    {message && <AppText className="text-center text-ink-2">{message}</AppText>}
  </View>
)
