import { ProgressBar } from "@/components/ProgressBar"
import { RewardIcon } from "@/components/RewardIcon"
import { RewardWithProgress } from "@/types"
import { describeReward, remainingLabel } from "@/utils/rewards"
import { Href, Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

type Props = {
  item: RewardWithProgress
  href: Href
  readyLabel: string
}

export const RewardProgressCard = ({ item: { reward, progress }, href, readyLabel }: Props) => {
  const isHighlighted = progress.isReady && progress.unit !== null
  const subtitle = progress.isFinished
    ? "One time offer · already received"
    : progress.unit
      ? `${describeReward(reward)} · ${isHighlighted ? "ready" : remainingLabel(progress)}`
      : `${describeReward(reward)} · no points needed`

  return (
    <Link href={href} asChild>
      <Pressable
        className={`mb-3 rounded-2xl bg-white p-4 ${
          isHighlighted ? "border-2 border-green-600" : "border border-gray-200"
        } ${progress.isFinished ? "opacity-60" : ""}`}
      >
        <View className="flex-row items-center">
          <RewardIcon reward={reward} size="small" tone={isHighlighted ? "success" : "primary"} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-900">{reward.title}</Text>
            <Text className="text-sm text-gray-600">{subtitle}</Text>
          </View>
          {isHighlighted && (
            <View className="rounded-full bg-green-600 px-3 py-1">
              <Text className="text-xs font-bold text-white">{readyLabel}</Text>
            </View>
          )}
          {progress.unit && !progress.isReady && !progress.isFinished && (
            <Text className="text-sm font-bold text-primary-700">
              {progress.current}/{progress.target}
            </Text>
          )}
        </View>
        {progress.unit && !progress.isFinished && (
          <View className="mt-3">
            <ProgressBar current={progress.current} target={progress.target} isReady={progress.isReady} />
          </View>
        )}
      </Pressable>
    </Link>
  )
}
