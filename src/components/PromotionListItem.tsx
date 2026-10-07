import { Promotion } from "@/types"
import { describePromotionTime, multiplierName, promotionStatus } from "@/utils/promotions"
import { Pressable, Text, View } from "react-native"

type Props = {
  promotion: Promotion
  now: Date
  timeZone: string
  isPending: boolean
  onEnd: () => void
}

const STATUS_CLASS = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-amber-100 text-amber-700",
  ended: "bg-gray-100 text-gray-500",
}

const STATUS_LABEL = {
  active: "Active",
  upcoming: "Upcoming",
  ended: "Ended",
}

export const PromotionListItem = ({ promotion, now, timeZone, isPending, onEnd }: Props) => {
  const status = promotionStatus(promotion, now)

  return (
    <View className={`mb-2 rounded-xl bg-white p-4 shadow-sm ${status === "ended" ? "opacity-60" : ""}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900">
          {multiplierName(promotion.multiplier)} (x{promotion.multiplier})
        </Text>
        <Text className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </Text>
      </View>
      <Text className="mt-1 text-sm text-gray-500">{describePromotionTime(promotion, now, timeZone)}</Text>
      {status !== "ended" && (
        <Pressable onPress={onEnd} disabled={isPending} className="mt-3 self-start">
          <Text className="font-semibold text-red-600">{status === "active" ? "End now" : "Cancel"}</Text>
        </Pressable>
      )}
    </View>
  )
}
