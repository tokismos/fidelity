import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  multiplier: number
}

export const PromotionBadge = ({ multiplier }: Props) => (
  <View className="flex-row items-center rounded-full bg-amber-400 px-2 py-1">
    <Ionicons name="flash" size={12} color={colors.white} />
    <Text className="ml-1 text-xs font-bold text-white">x{multiplier} points</Text>
  </View>
)
