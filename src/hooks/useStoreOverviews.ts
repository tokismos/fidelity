import { useAuth } from "@/hooks/useAuth"
import { useGetRewardsByStores } from "@/hooks/useGetRewardsByStores"
import { useGetUserGivenRewards } from "@/hooks/useGetUserGivenRewards"
import { useGetUserProgress } from "@/hooks/useGetUserProgress"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { RewardWithProgress, StoreOverview } from "@/types"
import { getRewardProgress, nextReward } from "@/utils/rewards"

// Every store card of the signed in customer, with the reward they are closest to
export const useStoreOverviews = () => {
  const { userId } = useAuth()
  const userStores = useGetUserStores()
  const storeIds = (userStores.data ?? []).map((userStore) => userStore.store.id)
  const rewards = useGetRewardsByStores({ storeIds })
  const progress = useGetUserProgress({ userId })
  const givenRewards = useGetUserGivenRewards({ userId })

  const overviews: StoreOverview[] = (userStores.data ?? []).map((userStore) => {
    const items: RewardWithProgress[] = (rewards.data ?? [])
      .filter((reward) => reward.store_id === userStore.store.id)
      .map((reward) => {
        const purchases = progress.data?.find((row) => row.reward_id === reward.id)?.purchases ?? 0
        const alreadyReceived = !!givenRewards.data?.some((given) => given.reward_id === reward.id)
        return { reward, progress: getRewardProgress(reward, userStore.points, purchases, alreadyReceived) }
      })

    return {
      userStore,
      items,
      readyCount: items.filter((item) => item.progress.isReady && item.progress.unit !== null).length,
      nextReward: nextReward(items),
    }
  })

  return {
    storeIds,
    overviews,
    isLoading: userStores.isLoading,
    isRefetching: userStores.isRefetching || rewards.isRefetching || progress.isRefetching,
    error: userStores.error ?? rewards.error ?? progress.error ?? givenRewards.error,
    refetch: () => Promise.all([userStores.refetch(), rewards.refetch(), progress.refetch(), givenRewards.refetch()]),
  }
}
