import { colors } from "@/constants/colors"
import { Promotion } from "@/types"
import { describePromotionTime, multiplierName, promotionStatus } from "@/utils/promotions"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  promotion: Promotion
  now: Date
  timeZone: string
}

export const PromotionBanner = ({ promotion, now, timeZone }: Props) => {
  const isActive = promotionStatus(promotion, now) === "active"
  const name = multiplierName(promotion.multiplier)

  return (
    <View className={`flex-row items-center rounded-xl p-4 ${isActive ? "bg-amber-400" : "bg-amber-50"}`}>
      <Ionicons
        name={isActive ? "flash" : "calendar-outline"}
        size={26}
        color={isActive ? colors.white : colors.warning}
      />
      <View className="ml-3 flex-1">
        <Text className={`text-base font-bold ${isActive ? "text-white" : "text-amber-800"}`}>
          {isActive ? `${name} now! x${promotion.multiplier}` : `${name} coming (x${promotion.multiplier})`}
        </Text>
        <Text className={`text-sm ${isActive ? "text-white" : "text-amber-700"}`}>
          {describePromotionTime(promotion, now, timeZone)}
        </Text>
      </View>
    </View>
  )
}
