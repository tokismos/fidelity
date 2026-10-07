import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PointsBalance } from "@/components/PointsBalance"
import { RewardDetailHeader } from "@/components/RewardDetailHeader"
import { RewardHistoryTitle } from "@/components/RewardHistoryTitle"
import { TimelineItem } from "@/components/TimelineItem"
import { RewardDetail } from "@/components/rewards/RewardDetail"
import { colors } from "@/constants/colors"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetReward } from "@/hooks/useGetReward"
import { rewardTimeline } from "@/utils/timeline"
import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { Link, useLocalSearchParams } from "expo-router"
import { Pressable, Text, View } from "react-native"

export default function UserReward() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>()
  const { userId } = useAuth()

  const reward = useGetReward({ rewardId })
  const storeId = reward.data?.store_id
  const customer = useCustomerRewards({ userId, storeId })
  const { timeline, refetch, isRefetching } = useCustomerTimeline({ userId, storeId })

  if (reward.isLoading || customer.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />

  const item = customer.items.find((entry) => entry.reward.id === rewardId)
  if (!item) return <ErrorView message="This reward is not available right now." />

  const header = (
    <View>
      <PointsBalance points={customer.points} label="Your points" />
      <View className="mt-6">
        <RewardDetailHeader reward={reward.data} />
      </View>
      <View className="mt-6">
        <RewardDetail reward={reward.data} progress={item.progress} />
      </View>
      {!item.progress.isFinished && (
        <Link href="/user/profile" asChild>
          <Pressable className="mt-4 flex-row items-center justify-center rounded-2xl bg-gray-900 py-4">
            <Ionicons name="qr-code-outline" size={22} color={colors.white} />
            <Text className="ml-2 text-base font-bold text-white">
              {item.progress.isReady ? "Show my code to get it" : "Show my code"}
            </Text>
          </Pressable>
        </Link>
      )}
      <RewardHistoryTitle />
    </View>
  )

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={rewardTimeline(timeline, rewardId)}
      keyExtractor={(entry) => `${entry.kind}-${entry.id}`}
      renderItem={({ item: entry }) => <TimelineItem entry={entry} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState icon="time-outline" title="Nothing yet" />}
      onRefresh={() => Promise.all([customer.refetch(), refetch()])}
      refreshing={customer.isRefetching || isRefetching}
    />
  )
}
