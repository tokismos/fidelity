import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { colors } from "@/constants/colors"
import { Promotion } from "@/types"
import { multiplierName } from "@/utils/promotions"
import { dayAndTime } from "@/utils/program"
import { formatDuration, formatTime, isSameDay, timeZoneLabel } from "@/utils/time"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

type Props = {
  promotion: Promotion
  now: Date
  timeZone: string
  onPress: () => void
}

// The sun card of the promotion running now, with the big time left
export const RunningPromotionCard = ({ promotion, now, timeZone, onPress }: Props) => {
  const end = new Date(promotion.ends_at)
  const endText = isSameDay(end, now, timeZone) ? `at ${formatTime(end, timeZone)}` : dayAndTime(end, now, timeZone)
  const name = multiplierName(promotion.multiplier)
  const left = formatDuration(end.getTime() - now.getTime())

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`Running now, ${name}, ${left} left`}
      className="mx-4 mt-4 bg-sun p-[18px]"
    >
      <View className="flex-row items-center gap-[6px] pr-10">
        <Ionicons name="flash-outline" size={16} color={colors.ink} />
        <AppText weight="bold" className="text-[13px]">
          Running now
        </AppText>
      </View>
      <AppText weight="black" numberOfLines={1} className="mt-[2px] pr-10 text-[22px] tracking-[-0.3px]">
        {name}
      </AppText>
      <View className="mt-[10px] flex-row items-baseline">
        <AppText weight="black" tabular numberOfLines={1} className="text-[48px] leading-[50px] tracking-[-1.5px]">
          {left}
        </AppText>
        <AppText weight="bold" className="ml-1 text-[18px]">
          left
        </AppText>
      </View>
      <AppText numberOfLines={1} className="mt-2 text-[14px]">
        Ends {endText}
        {timeZoneLabel(timeZone)}
      </AppText>
      <View className="absolute right-2 top-[10px] h-11 w-11 items-center justify-center">
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </View>
    </Card>
  )
}
