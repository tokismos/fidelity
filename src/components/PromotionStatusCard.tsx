import { colors } from "@/constants/colors"
import { Promotion } from "@/types"
import { multiplierName, promotionStatus } from "@/utils/promotions"
import { formatDayAndTime, formatDuration, formatTime } from "@/utils/time"
import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator, Pressable, Text, View } from "react-native"

type Props = {
  promotion: Promotion
  now: Date
  timeZone: string
  isPending: boolean
  onEnd: () => void
}

// The running or next promotion, with a countdown and the button to stop it
export const PromotionStatusCard = ({ promotion, now, timeZone, isPending, onEnd }: Props) => {
  const isActive = promotionStatus(promotion, now) === "active"
  const start = new Date(promotion.starts_at)
  const end = new Date(promotion.ends_at)

  return (
    <View className={`rounded-2xl p-4 ${isActive ? "bg-amber-400" : "bg-amber-50"}`}>
      <View className="flex-row items-center">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-amber-900/10">
          <Ionicons name={isActive ? "flash" : "calendar-outline"} size={26} color={colors.amberDark} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-xs font-extrabold uppercase tracking-wide text-amber-900">
            {isActive ? "Running now" : "Scheduled"}
          </Text>
          <Text className="text-xl font-extrabold text-amber-900">
            {multiplierName(promotion.multiplier)} · x{promotion.multiplier}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row">
        <View className="mr-2 flex-1 rounded-xl bg-white/50 px-3 py-2">
          <Text className="text-xs font-semibold text-amber-900">Starts</Text>
          <Text className="font-extrabold text-amber-900">
            {isActive ? formatTime(start, timeZone) : formatDayAndTime(start, now, timeZone)}
          </Text>
        </View>
        <View className="mr-2 flex-1 rounded-xl bg-white/50 px-3 py-2">
          <Text className="text-xs font-semibold text-amber-900">Ends</Text>
          <Text className="font-extrabold text-amber-900">{formatTime(end, timeZone)}</Text>
        </View>
        <View className="flex-1 rounded-xl bg-white/50 px-3 py-2">
          <Text className="text-xs font-semibold text-amber-900">{isActive ? "Time left" : "Starts in"}</Text>
          <Text className="font-extrabold text-amber-900">
            {formatDuration((isActive ? end : start).getTime() - now.getTime())}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onEnd}
        disabled={isPending}
        className="mt-3 flex-row items-center justify-center rounded-xl bg-amber-900 py-3"
      >
        {isPending ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text className="font-bold text-white">{isActive ? "End now" : "Cancel promotion"}</Text>
        )}
      </Pressable>
    </View>
  )
}
