import { Button } from "@/components/ui/Button"
import { Sheet } from "@/components/ui/Sheet"
import { useEndPromotion } from "@/hooks/useEndPromotion"
import { Promotion } from "@/types"
import { multiplierName, promotionStatus } from "@/utils/promotions"
import { dayAndTime } from "@/utils/program"
import { formatTime, isSameDay, timeZoneLabel } from "@/utils/time"
import { Alert, View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  promotion: Promotion | null
  now: Date
  timeZone: string
}

// "Started 2:00 PM, ends 6:00 PM" or "Starts Tomorrow 10:00 AM, ends 12:00 PM"
const timeLine = (promotion: Promotion, now: Date, timeZone: string) => {
  const start = new Date(promotion.starts_at)
  const end = new Date(promotion.ends_at)
  const isActive = promotionStatus(promotion, now) === "active"
  const startText =
    isActive && isSameDay(start, now, timeZone) ? formatTime(start, timeZone) : dayAndTime(start, now, timeZone)
  const endText = isSameDay(start, end, timeZone) ? formatTime(end, timeZone) : dayAndTime(end, now, timeZone)

  return `${isActive ? "Started" : "Starts"} ${startText}, ends ${endText}${timeZoneLabel(timeZone)}`
}

// The running promotion ("End it now") or the next one ("Cancel it")
export const PromotionActionsSheet = ({ visible, onClose, promotion, now, timeZone }: Props) => {
  const { endPromotion, isPending } = useEndPromotion()
  const isActive = !!promotion && promotionStatus(promotion, now) === "active"

  const confirmEnd = () => {
    if (!promotion) return
    Alert.alert(isActive ? "End promotion" : "Cancel promotion", isActive ? "End it now?" : "Cancel this promotion?", [
      { text: "Back", style: "cancel" },
      {
        text: isActive ? "End now" : "Cancel it",
        style: "destructive",
        onPress: () =>
          endPromotion(
            { promotionId: promotion.id },
            {
              onSuccess: onClose,
              onError: (error) => Alert.alert("Something went wrong", error.message),
            },
          ),
      },
    ])
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={promotion ? multiplierName(promotion.multiplier) : ""}
      subtitle={promotion ? timeLine(promotion, now, timeZone) : undefined}
    >
      <View className="gap-[10px]">
        <Button
          title={isActive ? "End it now" : "Cancel it"}
          variant="danger"
          isLoading={isPending}
          onPress={confirmEnd}
        />
        <Button title="Close" variant="line" onPress={onClose} />
      </View>
    </Sheet>
  )
}
