import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { PurchaseDots } from "@/components/ui/PurchaseDots"
import { colors } from "@/constants/colors"
import { RewardProgress } from "@/types"
import { toGoLine } from "@/utils/customerRewards"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

type Props = {
  // null for a wheel prize: it is ready, whatever the points
  progress: RewardProgress | null
  // Line under "Ready"
  readyMessage: string
}

// Where the customer stands on a reward: ready, still to go, or already received
export const RewardStateCard = ({ progress, readyMessage }: Props) => {
  if (!progress || (progress.isReady && !progress.isFinished)) {
    return (
      <Card className="flex-row items-center gap-3 bg-rose-soft p-4">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-rose">
          <Ionicons name="checkmark" size={18} color={colors.white} />
        </View>
        <View className="min-w-0 flex-1">
          <AppText weight="bold" className="text-[16px] text-rose-ink">
            Ready
          </AppText>
          <AppText className="text-[14px]">{readyMessage}</AppText>
        </View>
      </Card>
    )
  }

  if (progress.isFinished) {
    return (
      <Card className="flex-row items-center gap-3 p-4">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-sunk">
          <Ionicons name="checkmark-done" size={18} color={colors.ink2} />
        </View>
        <AppText weight="bold" className="min-w-0 flex-1 text-[16px]">
          Already received
        </AppText>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <AppText weight="bold" className="text-[16px]">
        {toGoLine(progress)}
      </AppText>
      {progress.unit === "purchases" && (
        <View className="mt-4">
          <PurchaseDots total={progress.target} filled={progress.current} size="l" />
        </View>
      )}
    </Card>
  )
}
