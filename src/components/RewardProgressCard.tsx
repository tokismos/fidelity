import { ProgressBar } from "@/components/ProgressBar"
import { RewardIcon } from "@/components/RewardIcon"
import { RewardWithProgress } from "@/types"
import { describeReward, progressLabel } from "@/utils/rewards"
import { Href, Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

type Props = {
  item: RewardWithProgress
  href: Href
  readyLabel: string
}

export const RewardProgressCard = ({ item: { reward, progress }, href, readyLabel }: Props) => (
  <Link href={href} asChild>
    <Pressable className="mb-3 rounded-xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        <RewardIcon reward={reward} size="small" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-900">{reward.title}</Text>
          <Text className="text-sm text-gray-500">{describeReward(reward)}</Text>
        </View>
        {progress.unit && progress.isReady && (
          <View className="rounded-full bg-green-100 px-3 py-1">
            <Text className="text-xs font-semibold text-green-700">{readyLabel}</Text>
          </View>
        )}
        {progress.isFinished && (
          <View className="rounded-full bg-gray-100 px-3 py-1">
            <Text className="text-xs font-semibold text-gray-600">Received</Text>
          </View>
        )}
      </View>
      <View className="mt-3">
        {progress.unit && !progress.isFinished && (
          <ProgressBar current={progress.current} target={progress.target} isReady={progress.isReady} />
        )}
        <Text className="mt-1 text-xs text-gray-500">{progressLabel(progress)}</Text>
      </View>
    </Pressable>
  </Link>
)
