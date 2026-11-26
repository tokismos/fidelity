import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { Chip } from "@/components/ui/Chip"
import { Tile } from "@/components/ui/Tile"
import { Reward, RewardProgress } from "@/types"
import { describeReward } from "@/utils/rewards"
import { View } from "react-native"

type Props = {
  reward: Reward
  // Missing when the reward is paused
  progress: RewardProgress | undefined
}

// Where the customer stands, in one short line
const statusNote = (progress: RewardProgress | undefined) => {
  if (!progress) return "Paused. Customers do not see it."
  if (progress.isFinished) return "Already given. It works only once."
  if (progress.unit === "points" && !progress.isReady) {
    const left = progress.target - progress.current
    return `${left} ${left === 1 ? "point" : "points"} to go`
  }
  return null
}

// A reward that is not a purchase card: its name, what it gives, and whether it is ready
export const RewardSummaryCard = ({ reward, progress }: Props) => {
  const note = statusNote(progress)
  const ready = !!progress?.isReady && !progress.isFinished

  return (
    <Card className="items-start px-[22px] pb-[26px] pt-6">
      <View className="w-full flex-row items-center justify-between">
        <Tile icon="gift-outline" tone={ready ? "rose" : "neutral"} size="l" imageUri={reward.config.image_path} />
        {ready && <Chip label="Ready" tone="rose" />}
      </View>
      <AppText weight="black" numberOfLines={3} className="mt-5 text-[30px] leading-[34px] tracking-[-0.6px]">
        {reward.title}
      </AppText>
      <AppText className="mt-[6px] text-ink-2">{reward.description || describeReward(reward)}</AppText>
      {note && (
        <AppText weight="bold" className="mt-4">
          {note}
        </AppText>
      )}
    </Card>
  )
}
